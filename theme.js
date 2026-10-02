(() => {
  const root = document.documentElement;
  const system = matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem('theme'); } catch { /* Storage can be disabled. */ }
  if (preference !== 'light' && preference !== 'dark') preference = null;
  root.dataset.theme = preference || (system.matches ? 'dark' : 'light');

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('theme-toggle');
    const updateLabel = () => {
      button.setAttribute('aria-label', `Switch to ${root.dataset.theme === 'dark' ? 'light' : 'dark'} theme`);
    };
    updateLabel();
    button.hidden = false;
    button.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = preference;
      try { localStorage.setItem('theme', preference); } catch { /* Toggle still works without persistence. */ }
      updateLabel();
    });
    system.addEventListener('change', () => {
      if (!preference) {
        root.dataset.theme = system.matches ? 'dark' : 'light';
        updateLabel();
      }
    });
  });
})();
