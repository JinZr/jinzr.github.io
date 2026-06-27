# Repository Guidelines

## Project Structure
- `src/` contains the editable Vite source for the Material 3 static site.
- `public/` contains static assets copied into the deploy output.
- Root `index.html`, `site-assets/`, `assets/`, `icons/`, `favicon.webp`, and `manifest.json` are generated deploy files for GitHub Pages.
- Do not reintroduce the old Flutter submodule, Flutter build artifacts, or root symlink deployment model.

## Commands
- `npm ci`: install locked dependencies.
- `npm run dev`: run the local Vite dev server.
- `npm run build`: build `dist/` and sync deploy output to the repo root.
- `npm run preview`: preview the production build locally.
- `npm run check`: rebuild and fail if committed deploy output is stale.

## Style
- Follow Material 3 tokens in `src/styles.css`.
- Keep the site static and dependency-light. Do not add React, Vue, Svelte, or a framework runtime.
- Preserve compact rendering around the 700px breakpoint.
- Keep content data local in `public/assets/texts/`.

## Validation
- Run `npm run build` after source or asset changes.
- For UI changes, verify desktop and mobile browser screenshots before committing.
