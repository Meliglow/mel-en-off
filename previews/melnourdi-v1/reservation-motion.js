(() => {
  const story = document.querySelector('.software-story');
  if (!story) return;
  const montage = story.querySelector('[data-montage]');
  const chapters = [...story.querySelectorAll('[data-story-step]')];
  const links = [...story.querySelectorAll('[data-story-nav]')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  function activate(index) {
    montage.dataset.phase = String(index);
    links.forEach(link => {
      if (Number(link.dataset.storyNav) === index) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
  }
  function watch() {
    observer?.disconnect();
    if (reduceMotion.matches || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      const focusLine = innerHeight * (matchMedia('(max-width:700px)').matches ? .65 : .5);
      const current = chapters.map(chapter => {
        const rect = chapter.getBoundingClientRect();
        const distance = focusLine < rect.top ? rect.top - focusLine : focusLine > rect.bottom ? focusLine - rect.bottom : 0;
        return {chapter, distance};
      }).sort((a,b) => a.distance - b.distance)[0];
      activate(Number(current.chapter.dataset.storyStep));
    }, {rootMargin: matchMedia('(max-width:700px)').matches ? '-48% 0px -8% 0px' : '-30% 0px -30% 0px', threshold:[0,.15,.35]});
    chapters.forEach(chapter => observer.observe(chapter));
  }
  links.forEach(link => link.addEventListener('click', () => activate(Number(link.dataset.storyNav))));
  reduceMotion.addEventListener('change', watch);
  matchMedia('(max-width:700px)').addEventListener('change', watch);
  watch();
})();
