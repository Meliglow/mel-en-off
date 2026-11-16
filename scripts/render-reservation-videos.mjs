// Build silent, captioned walkthroughs from local screenshots captured through the browser UI.
import {mkdir,writeFile,copyFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import sharp from 'sharp';
const root=process.cwd(),tmp=path.join(root,'tmp/video-captures'),out=path.join(root,'previews/melnourdi-v1/assets');
const ffmpeg=process.env.FFMPEG_PATH || path.join(root,'tmp/media-tools/node_modules/ffmpeg-static/ffmpeg.exe');
await mkdir(tmp,{recursive:true});
await copyFile('C:/Windows/Fonts/arial.ttf',path.join(tmp,'font.ttf'));
const sequences={reservation:[['reservation-1','Choisis une prestation.'],['reservation-2','Trouve un créneau disponible.'],['reservation-3','Renseigne tes informations.'],['reservation-4','Vois l’acompte et le solde.'],['reservation-5','Retrouve la confirmation.']],gestion:[['gestion-4','Ton planning, en un coup d’œil.'],['gestion-1','Tes rendez-vous et leurs acomptes.'],['gestion-2','Tes fiches clientes, au même endroit.'],['gestion-3','Les réglages de ton espace.']]};
const run=args=>{const result=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{cwd:tmp,encoding:'utf8'});if(result.status!==0)throw Error(result.stderr);};
for(const [name,scenes] of Object.entries(sequences)){
  const parts=[];
  for(let i=0;i<scenes.length;i++){
    const [capture,title]=scenes[i],part=`${name}-part-${i}.mp4`;
    await writeFile(path.join(tmp,'title.txt'),title);
    await writeFile(path.join(tmp,'footnote.txt'),'DÉMONSTRATION · DONNÉES FICTIVES · AUCUN PAIEMENT RÉEL');
    const filter="scale=1100:688,pad=1280:800:90:88:color=0x171b15,drawtext=fontfile=font.ttf:textfile=title.txt:fontcolor=0xe9f176:fontsize=28:x=90:y=17,drawtext=fontfile=font.ttf:textfile=footnote.txt:fontcolor=0xdce3d0:fontsize=13:x=90:y=54,fade=t=in:st=0:d=0.2,fade=t=out:st=3.7:d=0.3,format=yuv420p";
    run(['-loop','1','-i',`${capture}.jpg`,'-vf',filter,'-t','4','-r','24','-c:v','libx264','-preset','fast','-crf','23','-an',part]);
    parts.push(`file '${part}'`);
  }
  await writeFile(path.join(tmp,'concat.txt'),parts.join('\n'));
  run(['-f','concat','-safe','0','-i','concat.txt','-c','copy','-movflags','+faststart',path.join(out,`video-${name}.mp4`)]);
  run(['-ss','1','-i',path.join(out,`video-${name}.mp4`),'-frames:v','1',`${name}-poster.png`]);
  await sharp(path.join(tmp,`${name}-poster.png`)).jpeg({quality:85}).toFile(path.join(out,`video-${name}-poster.jpg`));
  console.log(`${name}: ${scenes.length*4}s, silent MP4 + poster`);
}
