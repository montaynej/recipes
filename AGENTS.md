# Project guidance

## Purpose and current status

Everyday Table is a responsive recipe website built incrementally with Eleventy. Visitors will browse recipes, plan meals, adjust servings, and generate a consolidated shopping list without accounts or a backend.

Phases 1–4 are complete: shared site layout, five recipes in JSON, a central ingredient catalogue, build-time validation, responsive listing cards, and five generated detail pages. Images are local SVG placeholders awaiting food photographs. Recipe cards and detail pages support add/remove selection, a navigation count, a dedicated Meal Plan page, localStorage persistence, storage error feedback, and cross-tab updates. Shopping List now combines compatible ingredient quantities and renders catalogue-driven categories, initially Fresh and Stock. Serving controls, checkboxes, and copying are deferred.

**Phase 5 requires the user's approval before implementation.** Git setup and documentation requests do not constitute approval to advance a phase. Work within the authorised phase and stop at its boundary. After each phase, report changes, validation, unresolved issues, and the next phase; wait for approval before advancing.

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
- `src/js/storage.js`: versioned localStorage reads/writes and sanitisation of recipe IDs.
- `src/js/meal-plan.js`: immutable selection toggling and rendering of the static meal-plan cards.
- `src/js/recipes.js`: selection controls, counts, announcements, focus handling, and cross-tab updates.
- `src/shopping-data.njk`: generates `/data/shopping.json` with recipe IDs, original servings, ingredient quantities, and the central catalogue; no instructions or descriptions.
- `src/js/shopping-list.js`: pure aggregation and quantity formatting; accepts optional per-recipe serving overrides.
- `src/js/shopping-list-ui.js`: lazy fetch, category rendering, empty/loading/error states, and retry. Loaded dynamically on the shopping page from `recipes.js`.
- `README.md`: setup instructions, architecture, and phase overview.

## Data and interaction rules

Preserve implemented behaviour below; introduce later requirements only within their approved phases.

- The central ingredient catalogue owns unique IDs, names, categories, and default units. Recipes reference ingredient IDs rather than duplicating metadata.
- Validate ingredient references at build time; unknown IDs must fail clearly rather than silently disappear.
- Recipe HTML is generated at build time. Phase 3 embeds only a list of valid IDs globally and reuses pre-rendered cards on the Meal Plan page. Phase 4 generates a compact static JSON endpoint fetched only by the shopping page when recipes are selected. Avoid embedding the full recipe dataset in every page; omit instructions from the endpoint when unnecessary.
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

Phase 3 build, module syntax, selection/storage logic, error handling, and generated-markup checks passed. Browser interaction and formal accessibility checks remain outstanding. Storage key is `everyday-table:meal-plan:v1`, with payload `{ version: 1, recipeIds: [...] }`; preserve or migrate existing selections when extending the schema.

Phase 4 build, syntax, endpoint, aggregation, conversions, incompatible units, invalid references, formatting, and immutability checks passed. A lightweight DOM adapter checked rendering, loading, selection changes during requests, errors, and retry. These were inline verification checks, not a retained test suite or browser QA. No storage migration was needed.

Phase 6 will use Node's built-in test runner for aggregation: single/multiple recipes, duplicates, compatible conversions, incompatible units, serving changes, removal, empty plans, and invalid references. No test script exists yet.

## Remaining phases

5. Serving adjustment, search/filter, purchased checkboxes, clipboard copying, and responsive/accessibility improvements.
6. Automated tests, accessibility/performance review, image optimisation, and GitHub Pages or Netlify deployment preparation.

## Maintaining this file

Keep this `AGENTS.md` updated when an approved phase is completed or project commands, structure, architectural decisions, or constraints change. Distinguish implemented behaviour from planned behaviour. Keep `README.md` consistent with these facts. Record durable project guidance rather than a running transcript, and verify Git state before describing repository or remote configuration. The user's latest explicit instructions take precedence over this file.
