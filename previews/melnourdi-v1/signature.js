// Animations d'apparition (même rendu que la page de vente du logiciel)
(()=>{const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hl=document.querySelector('h1 .highlight');
if(hl&&!reduce){hl.classList.add('sig-draw');requestAnimationFrame(()=>setTimeout(()=>hl.classList.add('sig-on'),150))}
if(reduce||!('IntersectionObserver' in window))return;
const sel='main section h2, main section .section-intro p, .pain-grid li, .course-feature, .course-note, .intro-photo, .intro-copy, .faq-list details, .free-copy, .lead-form, .guide-section, main article, .link-list a, .links-list a';
const els=[...document.querySelectorAll(sel)].filter(el=>el.getBoundingClientRect().top>innerHeight*.9);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('sig-pre');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
els.forEach(el=>{const sib=el.parentElement?[...el.parentElement.children].indexOf(el)%4:0;el.classList.add('sig-rv','sig-pre');if(sib)el.classList.add('sig-d'+sib);io.observe(el)});
})();
