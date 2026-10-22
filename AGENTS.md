# Project guidance

## Purpose and current status

Everyday Table is a responsive recipe website built incrementally with Eleventy. Visitors will browse recipes, plan meals, adjust servings, and generate a consolidated shopping list without accounts or a backend.

Phases 1 and 2 are complete: shared site layout, five recipes in JSON, a central ingredient catalogue, build-time validation, responsive listing cards, and five generated detail pages. Images are local SVG placeholders awaiting food photographs. Meal Plan and Shopping List remain placeholders; interactive functionality is not implemented yet.

**Phase 3 requires the user's approval before implementation.** Git setup and documentation requests do not constitute approval to advance a phase. Work within the authorised phase and stop at its boundary. After each phase, report changes, validation, unresolved issues, and the next phase; wait for approval before advancing.

## Stack and conventions

- Use Eleventy, Nunjucks, semantic HTML, CSS, JSON, and JavaScript ES modules.
- Use Node.js 20 or newer and npm. Eleventy is currently the only direct development dependency.
- Do not introduce React, Vue, Angular, TypeScript, external databases, or a large CSS framework.
- Keep dependencies minimal and explain additions.
- Inspect existing files before modifying them. Prefer simple, focused modules and descriptive names; comment non-obvious logic.
- Edit source files under `src/`, not generated files under `_site/`.
- Keep `node_modules/` and `_site/` ignored; commit `package-lock.json` with dependency changes.
- Use Eleventy's `url` filter for internal template links and asset paths so a deployment prefix can be supported.

## Structure

- `eleventy.config.js`: ES module configuration; input `src/`, output `_site/`, asset copying, and polling for this OneDrive workspace.
- `src/_data/`: shared site data and separate recipe and ingredient JSON files.
- `src/_includes/layouts/`: shared page layouts.
- `src/_includes/components/`: reusable interface components.
- `src/recipes/`: `recipe.njk` uses Eleventy pagination to generate one static detail page per recipe.
- `src/css/`, `src/js/`, `src/images/`: stylesheet, browser modules, and replaceable image assets.
- `lib/validate-recipes.js`: validates catalogue metadata, recipe fields, ingredient references, quantities, units, and unique recipe IDs before every build.
- `README.md`: setup instructions, architecture, and phase overview.

## Planned data and interaction rules

These are requirements for later phases, not instructions to implement them immediately.

- The central ingredient catalogue owns unique IDs, names, categories, and default units. Recipes reference ingredient IDs rather than duplicating metadata.
- Validate ingredient references at build time; unknown IDs must fail clearly rather than silently disappear.
- Generate recipe HTML at build time and a compact static JSON endpoint for browser functionality. Avoid embedding the full recipe dataset in every page; omit instructions from the endpoint when unnecessary.
- Separate storage, selection, serving controls, aggregation, and DOM rendering. Use localStorage for selected recipe IDs, serving counts, and purchased-item state; handle malformed or unavailable storage gracefully.
- Implement shopping-list aggregation as a pure function. Scale quantities to selected servings, combine by ingredient ID and compatible units, and group using catalogue categories, initially Fresh and Stock.
- Convert kg to g and L to ml. Keep incompatible units, such as grams and whole items, separate. Format quantities without unnecessary decimals.
- Preserve extensibility for additional ingredient categories without unnecessary abstraction.

## Accessibility and design

Use a mobile-first layout, CSS custom properties, Grid/Flexbox where appropriate, generous spacing, and clear typography. Follow WCAG 2.2 AA principles where practical: semantic landmarks, labelled controls, keyboard access, visible focus, descriptive image alternatives, sensible headings, and accessible update feedback. Selection state must be communicated with more than colour.

## Commands and validation

```sh
npm ci
npm run dev
npm run build
```

The development URL is normally `http://localhost:8080`. Build output is `_site/`. File watching polls every 500 ms for OneDrive reliability. Restricted environments may block npm networking, file watching, or local HTTP access; report actual failures and use the environment's permission mechanism when needed.

Run the build for template, configuration, or data changes. Check the development server for server-related changes. Do not claim visual or accessibility verification unless performed. Documentation-only edits do not need a build.

Phase 6 will use Node's built-in test runner for aggregation: single/multiple recipes, duplicates, compatible conversions, incompatible units, serving changes, removal, empty plans, and invalid references. No test script exists yet.

## Remaining phases

3. Recipe selection, Meal Plan interface, and localStorage persistence.
4. Ingredient aggregation, Fresh/Stock grouping, measurement handling, and shopping-list interface.
5. Serving adjustment, search/filter, purchased checkboxes, clipboard copying, and responsive/accessibility improvements.
6. Automated tests, accessibility/performance review, image optimisation, and GitHub Pages or Netlify deployment preparation.

## Maintaining this file

Keep this `AGENTS.md` updated when an approved phase is completed or project commands, structure, architectural decisions, or constraints change. Distinguish implemented behaviour from planned behaviour. Keep `README.md` consistent with these facts. Record durable project guidance rather than a running transcript, and verify Git state before describing repository or remote configuration. The user's latest explicit instructions take precedence over this file.
