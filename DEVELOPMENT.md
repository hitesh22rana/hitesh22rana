# Portfolio

A single-page portfolio using HTML, CSS, and a small theme script. No build or dependencies.

## Preview

```sh
python3 -m http.server 5173 --bind 127.0.0.1
```

Open http://127.0.0.1:5173.

## Check

```sh
node theme.test.mjs
node motion.test.mjs
```

Edit content in `index.html`, styling in `style.css`, and replace `resume.pdf` when the resume changes.
The theme follows the system until the visitor chooses light or dark, then saves that choice locally.
Geist and Geist Mono are self-hosted in `fonts/`, with their license alongside them. System fonts remain as fallbacks.
Social links use inline Tabler SVG icons, with their license in `icons/LICENSE.txt` and accessible names on each link.
Motion uses native CSS and the Web Animations API. Reduced motion disables movement and smooth scrolling; content stays readable without JavaScript.
The site can be hosted as static files; no server-side routing is needed.
