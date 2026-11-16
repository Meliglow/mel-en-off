import { mkdir, readFile, writeFile, rename, stat, rm } from 'node:fs/promises';
import path from 'node:path';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import defaults from '@/config/booking-offer.json';

export type OfferConfig = typeof defaults;
export type BookingRecord = Record<string, any>;
type Store = { config: OfferConfig; launchUsed: number; requests: BookingRecord[]; login: Record<string, { digest: string; expires: number; attempts: number }>; };
export function storageReady() { return Boolean(process.env.BOOKING_DATA_DIR && /^[a-f0-9]{64}$/i.test(process.env.BOOKING_DATA_KEY || '')); }
const fresh = (): Store => ({ config: structuredClone(defaults), launchUsed: 0, requests: [], login: {} });
function key() { if (!storageReady()) throw new Error('Stockage non configuré.'); return Buffer.from(process.env.BOOKING_DATA_KEY!, 'hex'); }
function encrypt(store: Store) { const iv = randomBytes(12); const cipher = createCipheriv('aes-256-gcm', key(), iv); const ciphertext = Buffer.concat([cipher.update(JSON.stringify(store), 'utf8'), cipher.final()]); return Buffer.concat([Buffer.from('MNR1'), iv, cipher.getAuthTag(), ciphertext]); }
function decrypt(data: Buffer): Store { if (data.subarray(0,4).toString() !== 'MNR1') throw new Error('Format de stockage invalide.'); const decipher = createDecipheriv('aes-256-gcm', key(), data.subarray(4,16)); decipher.setAuthTag(data.subarray(16,32)); return JSON.parse(Buffer.concat([decipher.update(data.subarray(32)), decipher.final()]).toString()); }
export async function withStore<T>(work: (store: Store) => T | Promise<T>, write = true): Promise<T> {
  key();
  const dir = process.env.BOOKING_DATA_DIR!; await mkdir(dir, { recursive: true, mode: 0o700 });
  const lock = path.join(dir, '.lock'); let acquired = false;
  for (let attempt=0; attempt<100; attempt++) { try { await mkdir(lock); acquired = true; break; } catch (error: any) { if (error.code !== 'EEXIST') throw error; const age = await stat(lock).catch(() => null); if (age && Date.now() - age.mtimeMs > 30000) await rm(lock, { recursive: true, force: true }); await new Promise(resolve => setTimeout(resolve, 40)); } }
  if (!acquired) throw new Error('Stockage occupé, réessaie.');
  const target = path.join(dir, 'requests.enc');
  try {
    let store: Store; let previous: Buffer | null = null;
    try { previous = await readFile(target); store = decrypt(previous); } catch (error: any) { if (error.code !== 'ENOENT') throw error; store = fresh(); }
    const result = await work(store);
    if (write) { const temp = path.join(dir, `.pending-${randomBytes(8).toString('hex')}`); await writeFile(temp, encrypt(store), { mode:0o600, flag:'wx' }); if (previous) await writeFile(path.join(dir,'requests.backup.enc'), previous, {mode:0o600}); await rename(temp,target); }
    return result;
  } finally { await rm(lock,{recursive:true,force:true}); }
}
export async function offerState() { return storageReady() ? withStore(store => ({config:store.config,launchUsed:store.launchUsed}),false) : {config:defaults,launchUsed:0}; }
