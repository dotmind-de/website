# Gallery inbox

Drop raw material for new gallery entries here, one folder per project. Raw files are not committed;
They are optimised into `public/projects/<slug>/` and added to `src/content/projects.ts`.

```
assets-inbox/
  <projekt-name>/
    info.md          ← copy from _beispiel-projekt/info.md and fill in
    desktop-*.png    ← screenshots, 1440 px wide or more
    mobile-*.png     ← 390–430 px wide
    full-*.png       ← optional full-page capture
    figma-*.png      ← Figma frames, exported as PNG @2x
    source/          ← optional: project source code, if no screenshots exist
```
