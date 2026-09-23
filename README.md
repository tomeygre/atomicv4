# Atomic Strategy — Portfolio

Single-page site for Atomic Strategy, a boutique brand &amp; marketing strategy studio.
Plain HTML/CSS/JS, no build step, no dependencies.

## Structure

```
index.html          Page markup
styles.css           All styles (black / coral glow design system)
script.js             Language switch (EL/EN) + small UI behaviors
assets/
  favicon.svg         Site icon
  logo.png             Brand mark
  images/              Drop project screenshots here
```

## Language

The site defaults to Greek (`el`) and offers an English toggle in the header
(the "ΕΛ / EN" buttons). Text is driven by `data-i18n*` attributes in
`index.html` and the `translations` dictionary in `script.js`. The visitor's
choice is remembered in `localStorage`.

To edit copy: change the strings in the `translations.el` / `translations.en`
objects in `script.js` — do not edit the placeholder text in `index.html`
directly, it gets overwritten on load.

## Case studies (TODO)

The "Work" section (`#work` in `index.html`) currently has three placeholder
cards marked `TODO(case-study-1/2/3)`. To replace them with real projects:

1. Add a screenshot to `assets/images/` (e.g. `project-1.jpg`).
2. Swap the placeholder `<span>` in `.work-media` for an `<img>` pointing at it.
3. Update the title, one-line tagline, and tech-stack tags in `.work-body`.
4. Fill in the "Live site" / "Case study" links and remove `is-disabled`.
5. Remove the `is-placeholder` class from the `<article class="work-card">`.
6. Update or remove the matching `project.placeholderTitle*` strings in
   `script.js` (or just hardcode the final copy directly in the HTML).

Also update the placeholder contact email and GitHub/LinkedIn links in the
`#contact` section before publishing.

## Local preview

No build step — just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python -m http.server 8000
```

## Deployment

This is a static site (no backend, no build), so any static host works.
Three simple, free options:

### 1. GitHub Pages (simplest if you're already using GitHub)

1. Push this repo to GitHub (e.g. `git remote add origin <url>` then `git push -u origin main`).
2. On GitHub: **Settings → Pages → Source** → select the `main` branch and `/ (root)` folder → **Save**.
3. GitHub gives you a URL like `https://<username>.github.io/<repo>/` within a minute or two.
4. Optional: add a custom domain under **Settings → Pages → Custom domain**.

### 2. Netlify (drag-and-drop, fastest to try)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the project folder onto the page — it deploys instantly with a live URL.
3. For ongoing updates, connect the GitHub repo instead (**Add new site → Import an existing project**) so every push auto-deploys.

### 3. Vercel

1. Install the CLI (`npm i -g vercel`) or connect the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Other** (no build command, output directory `.`).
3. Deploy — Vercel gives you a live URL and redeploys on every push if connected to GitHub.

**Recommendation:** since there's no build step, GitHub Pages is the least
fuss if the repo is already on GitHub (steps 1–4 above, no CLI needed).
Netlify's drag-and-drop is the fastest way to get a link right now without
even creating a GitHub repo first.
