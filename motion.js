(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reduced.matches) continue;
      entry.target.animate(
        [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 500, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      );
    }
  }, { threshold: 0.12 });

  document.querySelectorAll('.section-heading, .projects li, .experience li, .more-link, footer')
    .forEach((element) => observer.observe(element));
})();
