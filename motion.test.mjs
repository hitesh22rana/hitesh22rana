import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('./motion.js', import.meta.url), 'utf8');
for (const reduceMotion of [false, true]) {
  const preference = { matches: reduceMotion };
  const observed = new Set();
  let callback;
  let animations = 0;
  const element = { animate: () => { animations++; } };
  class IntersectionObserver {
    constructor(fn) { callback = fn; }
    observe(target) { observed.add(target); }
    unobserve(target) { observed.delete(target); }
  }
  runInNewContext(source, {
    matchMedia: () => preference,
    window: { IntersectionObserver },
    IntersectionObserver,
    document: { querySelectorAll: () => [element] },
  });
  if (reduceMotion) {
    assert.equal(callback, undefined, 'Reduced motion must not start reveals');
    continue;
  }
  callback([{ target: element, isIntersecting: false }]);
  assert.equal(animations, 0, 'Offscreen content must not animate');
  callback([{ target: element, isIntersecting: true }]);
  assert.equal(animations, 1);
  assert.equal(observed.size, 0, 'Revealed content must stop being observed');
  preference.matches = true;
  callback([{ target: element, isIntersecting: true }]);
  assert.equal(animations, 1, 'Changing motion preference must suppress pending reveals');
}
runInNewContext(source, { matchMedia: () => ({ matches: false }), window: {} });
console.log('Motion checks passed.');
