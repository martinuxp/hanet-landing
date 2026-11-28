# HaNet · landing

La página del proyecto [HaNet](https://github.com/HaNet-Chile/hanetcl), para `hanet.muxp.art`. Hecha con [Astro](https://astro.build): una sola página estática, sin backend ni cookies.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # sitio estático en dist/
```

- Textos: `src/data/content.ts` (vista para instituciones y vista para estudiantes, `#estudiantes`).
- Página: `src/pages/index.astro`; estilos en `src/styles/landing.css`; interacción en `src/scripts/landing.ts`.
- Capturas del teléfono: `public/screens/` (la app web con datos de ejemplo, sin personas reales).
- Novedades: `npm run build` trae las últimas versiones de `constants/changelog.json` de hanetcl (`scripts/sync-changelog.mjs`); sin red, usa la copia de `src/data/changelog.json`.

Se publica en Cloudflare: cada push a `main` lo construye (`npm run build`, carpeta `dist`).

Este repositorio es público: nunca subas secretos ni datos de estudiantes. La fuente Google Sans Flex va con su licencia (`src/assets/fonts/OFL.txt`).
