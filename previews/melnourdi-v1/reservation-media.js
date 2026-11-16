(() => {
  const video=document.querySelector('#software-video');
  if(!video)return;
  document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>{
    if(button.getAttribute('aria-pressed')==='true'){video.play().catch(()=>video.focus());return;}
    video.pause();
    const choice=button.dataset.video;
    video.src=`/melnourdi/assets/video-${choice}.mp4`;
    video.poster=`/melnourdi/assets/video-${choice}-poster.jpg`;
    video.setAttribute('aria-label',choice==='reservation'?'Démonstration vidéo : réserver un rendez-vous':'Démonstration vidéo : gérer son activité');
    video.load();
    video.play().catch(()=>video.focus());
    document.querySelectorAll('[data-video]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  }));
})();
