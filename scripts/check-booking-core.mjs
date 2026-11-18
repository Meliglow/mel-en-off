import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {services,slots,seedAppointments,isOpen,addDays,fromTime} from '../previews/melnourdi-v1/lodyva-schedule.mjs';
import {validateRequest} from '../lib/booking-validation.mjs';
const config=JSON.parse(await readFile(new URL('../config/booking-offer.json',import.meta.url)));
const now=new Date('2026-11-16T08:00:00Z'),base='2026-11-16',seed=seedAppointments(base);
assert.deepEqual(slots('2026-11-16',60,[], '',now),[],'Monday closed');
assert.deepEqual(slots('2026-11-15',60,[], '',now),[],'Past blocked');
for(let day=1;day<28;day++){const date=addDays(base,day);for(const s of services){const choices=slots(date,s.duration,seed,'',now);if(!isOpen(date))assert.equal(choices.length,0);for(const t of choices){const start=fromTime(t);assert.ok(start>=540&&start+s.duration<=1080);assert.ok(start+s.duration<=780||start>=840,'No lunch overlap');assert.ok(!seed.some(a=>a.date===date&&start<a.start+a.duration+15&&start+s.duration+15>a.start),'No booking overlap including buffers');}}}
const slot=slots('2026-11-17',60,seed,'',now)[0];const added={id:'new',date:'2026-11-17',start:fromTime(slot),duration:60,status:'confirmed'};assert.ok(!slots(added.date,60,[...seed,added],'',now).includes(slot));assert.ok(slots(added.date,60,[...seed,added],'new',now).includes(slot));assert.ok(slots(added.date,60,[...seed,{...added,status:'cancelled'}],'',now).includes(slot));
const request={fields:{country:'FR',team:'solo',location:'salon',domainOwned:'no',domainHelp:'yes',businessName:'Institut Test',softwareUsed:'no',businessEmail:'test@example.test',firstName:'Test',lastName:'Demo',phone:'+33600000000',contactPreference:'email',serviceCount:'6',usesGoogle:'yes',reminderWhen:'24h'},options:['google','reminder'],consent:true};
assert.equal(validateRequest(request,config,0).knownSubtotal,368);assert.equal(validateRequest(request,config,9).knownSubtotal,368);assert.equal(validateRequest(request,config,10).knownSubtotal,468);assert.equal(validateRequest(request,config,0).basePrice,290);assert.throws(()=>validateRequest({...request,consent:false},config));assert.throws(()=>validateRequest({...request,options:['invented']},config));assert.throws(()=>validateRequest({...request,fields:{...request.fields,country:''}},config));
const deposit=validateRequest({...request,options:['payment'],fields:{...request.fields,paymentProvider:'none',paymentMode:'deposit'}},config);assert.equal(deposit.knownSubtotal,290);assert.ok(!deposit.toQuote.includes('Acompte en ligne'));
for (const creationPayment of ['1x','3x']) { const result=validateRequest({...request,fields:{...request.fields,creationPayment}},config); assert.equal(result.fields.creationPayment,creationPayment); assert.equal(result.knownSubtotal,368); }
assert.throws(()=>validateRequest({...request,fields:{...request.fields,creationPayment:'12x'}},config));
console.log('PASS: schedule, closed days, lunch, durations, buffer, move/cancel, pricing, first ten boundary, included deposit and input validation.');
