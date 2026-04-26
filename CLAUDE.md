@AGENTS.md

## Project overview

Romanian language learning app (Limba Română). Single-page Next.js app that renders markdown lecture content with a sidebar, section navigation, and global search.

## Architecture

- **Content**: Markdown files in `src/content/` (lectures, konspekt, dictionary). Imported as raw strings via Turbopack/webpack `raw-loader`.
- **Search**: Fuse.js fuzzy search via API route (`src/app/api/search/route.ts`). Indexes all markdown content server-side, returns results with match highlights.
- **UI**: Single client component (`src/app/page.tsx`) with hash-based routing, sidebar navigation, search modal (⌘K), and translate button (Google Translate RU→RO).
- **Styling**: Tailwind CSS 4 with CSS custom properties for dark theme. Design tokens in `globals.css`.

## Content rules

- All Romanian text MUST use proper diacritics: ă, â, î, ș, ț (never plain ASCII approximations)
- Content is bilingual Romanian-Russian. Don't modify Russian text when editing Romanian.
- Table headers use "Română" (not "Romana")
