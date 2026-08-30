# abirdeol.tech

My personal site: projects, write-ups, and the things I do when I'm not writing code.
Built with [Astro](https://astro.build), statically generated, no client framework.

**[abirdeol.tech](https://abirdeol.tech)**

## Structure

```
src/pages/          routes — index, projects, passions, research, work, connect
src/layouts/        SystemLayout, the shared page shell
src/components/     Starfield, ConstellationGlyph, ProjectArtifact, SectionHeader, ThemeToggle
src/data/           the content itself, as plain JS modules
src/styles/         theme.css — design tokens, light and dark
public/             static assets and the resume PDF
```

## Content lives in `src/data/`

Pages are templates; nothing is written into markup. Adding a project means adding an
object to `projects.js`, not touching a page.

| File | Holds |
| --- | --- |
| `projects.js` | Every project: slug, blurb, summary, highlights, stack, repo link |
| `postmortems.js` | The bug write-ups under `/research` |
| `passions.js` | Non-code sections |

Project copy is mirrored from each repo's own README, so the two are meant to stay in
step — if a README's claims change, the entry here changes with it.

## Develop

Requires Node 22.12+.

```bash
git clone https://github.com/apollo-2006/personal_portfolio.git
cd personal_portfolio

npm install
npm run dev        # http://localhost:4321
```

`npm run build` writes the static site to `dist/`; `npm run preview` serves that build.

## Author

**Abir Deol**
