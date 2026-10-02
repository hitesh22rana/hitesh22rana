import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('./theme.js', import.meta.url), 'utf8');
for (const stored of [null, 'light', 'dark', 'invalid', 'unavailable']) {
  const handlers = {};
  const root = { dataset: {} };
  const system = { matches: true, addEventListener: (_, fn) => { handlers.system = fn; } };
  const button = {
    hidden: true,
    setAttribute: (_, value) => { button.label = value; },
    addEventListener: (_, fn) => { handlers.click = fn; },
  };
  let saved = stored;
  runInNewContext(source, {
    matchMedia: () => system,
    localStorage: {
      getItem: () => { if (stored === 'unavailable') throw Error('Disabled'); return saved; },
      setItem: (_, value) => { if (stored === 'unavailable') throw Error('Disabled'); saved = value; },
    },
    document: {
      documentElement: root,
      getElementById: () => button,
      addEventListener: (_, fn) => { handlers.ready = fn; },
    },
  });
  assert.equal(root.dataset.theme, stored === 'light' ? 'light' : 'dark');
  handlers.ready();
  assert.equal(button.hidden, false);
  system.matches = false;
  handlers.system();
  assert.equal(root.dataset.theme, stored === 'dark' ? 'dark' : 'light');
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  handlers.click();
  assert.equal(root.dataset.theme, next);
  assert.equal(button.label, `Switch to ${next === 'dark' ? 'light' : 'dark'} theme`);
  if (stored !== 'unavailable') assert.equal(saved, next);
  system.matches = true;
  handlers.system();
  assert.equal(root.dataset.theme, next, 'Explicit choice must survive system changes');
}
console.log('Theme checks passed.');
