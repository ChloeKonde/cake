# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Кексомагия / Cake Magic" is a cartoon loaf-cake baking game, served at cake.vibecode.cat. The core product rule is that **the player cannot make a bad cake**. Every mechanic absorbs "mistakes": the bowl adds missing ingredients, the oven finishes undercooked cakes, all decoration options look good together, and the score is always above 10/10. Keep that rule when adding features.

## Running / deploying

- This machine is for development only. Don't run Docker, servers or the app here.
- Production: `docker compose up -d --build`. This builds an `nginx:alpine` image that serves `public/` and binds `${CAKE_BIND:-127.0.0.1}:1338 -> 80`. The host's general nginx proxies the domain to it (`deploy/cake.vibecode.cat.conf`). The container exposes `/healthz`.
- There's no build step, package manager, linter or test suite. It's plain ES modules loaded directly by the browser.
- `index.html` loads `style.css?v=N` and `js/main.js?v=N`, and nginx caches assets for 1h. Bump `N` when you change assets. The modules that `main.js` imports have no version query, so browsers can serve stale copies for up to an hour after a deploy.

## Architecture (`public/js/`)

- There are two modes. **Factory** (`factory.js`, step `factory`) is a Comfy Cakes-style conveyor. **Free baking** is the five-step builder in `main.js`.
- `factory.js` keeps its own module-level state `F`. `renderFactory(env, entering)` rebuilds the DOM from `F`, so it's safe to re-render. The belt advances in discrete slot steps (`PITCH`), and every slot in `SLOT_X` is a station, so after each move every cake sits exactly under a machine. Each step is a `move` phase followed by a `dwell` phase. The dwell lasts until each cake under an active machine is served or the level's timeout runs out. Level difficulty (active stations, cakes per level, spawn gap, timings) all comes from `params(L)`. The factory is laid out on a fixed 960×540 stage, scaled to fit with a CSS transform (`fit()`). A delivered cake goes to whichever open order it matches exactly. Otherwise it goes to its own order and counts as "love". It never counts as a failure.
- `main.js` is the state machine for the steps `start → filling → mix → bake → decorate → reveal`. All mutable state lives in the single `S` object. `go(step)` changes the step and calls `render(entering)`, which re-renders the whole `#scene` and `#panel` and rebinds events. Code that should run only once when a step is first shown (chef line, fanfare, saving to the shelf) is gated on `entering`. A language switch calls `render()` without it, so render functions must be safe to call repeatedly. Per-frame work goes through `loop(fn)`, a single rAF loop that `render`/`go` cancel. Loops look up DOM nodes by id on each tick instead of holding references, so a re-render mid-animation is safe.
- `cake.js` turns a cake config `{filling, glaze, sprinkles, toppings[], eyes, mouth, extras[], seed}` into SVG markup strings. `cakeSVG(c, {bake, rise, pan, mood})` is used everywhere: oven (partly baked, in a pan), decorate, reveal, shelf thumbnails and PNG export. `sliceSVG(c)` draws the 10×13 cut face. Colours are inline attributes, never CSS variables, so the markup can be rasterised to PNG through a `data:` URI. The geometry is hand-tuned path constants (`CAP`, `BODY`, `SIDE`, `GLAZE`, `CRACK`) in a 440×360 viewBox, with the cake group shifted by `translate(0 25)`.
- Randomness in a cake (chunk placement, drips, sprinkles, name, score) comes from `rng(c.seed)` in `util.js`, so a saved config always renders the same. Inside `cakeSVG` the RNG is consumed in a fixed order, so adding a new random draw early in it will shuffle existing layouts.
- `scenes.js` has the bowl (a `Bowl` class that updates SVG attributes in place each frame), the oven (its knobs are eyes, and `#ovCake` is a nested `<svg>` whose innerHTML is replaced with `cakeSVG`), and the Chef Murzik cat SVG.
- `data.js` holds the curated option lists (fillings with palettes, glazes, sprinkles, toppings, extras, filling→topping `PAIRINGS` for "Surprise!"). `i18n.js` holds all RU/EN strings, chef lines and cake-name parts. A new option needs both a `data.js` entry and labels in both languages.
- `icons.js` has hand-drawn SVG icons for the magic extras, ingredients and modes. Don't use emoji for game objects: they look different on every platform and clash with the art.
- `fx.js` has WebAudio-synthesised sound effects (no audio files) and canvas confetti.
- SVG animations (blink, wing flap, bob, flicker, twinkle) are CSS classes in `style.css` using `transform-box: fill-box`. Elements with a positioning `transform` attribute wrap an inner `<g class="...">` for the animation, because a CSS transform would override the attribute.
- localStorage keys: `cake-shelf` (last 12 cakes), `cake-lang`, `cake-muted`, `cake-factory-best`. Every access is wrapped in try/catch.
