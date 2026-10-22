# Everyday Table

An incremental Eleventy recipe website. Phase 1 provides the static site foundation; recipe data and interactive features are intentionally deferred.

## Run locally

Use Node.js 20 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Eleventy (normally http://localhost:8080). The development server watches source files and reloads the browser after changes. Stop it with Ctrl+C.

File watching uses polling at 500 ms intervals for reliability in this OneDrive workspace. If a restricted execution environment reports `EMFILE` or blocks localhost, run the development command in a normal terminal with filesystem and local network access.

```sh
npm run build
```

The production build writes to `_site/`. Generated files and `node_modules/` are ignored by Git. Commit `package-lock.json` to keep installations reproducible.

## Structure and architecture

- `eleventy.config.js`: ES module configuration, source/output directories, and static asset copying.
- `src/_data/`: shared build-time data. `site.json` holds the site identity; recipe and ingredient JSON will follow in Phase 2.
- `src/_includes/layouts/`: shared document layout.
- `src/_includes/components/`: reusable navigation and footer; recipe and shopping components will follow.
- `src/recipes/`: reserved for a paginated Nunjucks template generating one page per recipe.
- `src/css/`, `src/js/`, `src/images/`: static assets, copied without bundling. Empty directories contain `.gitkeep` files.
- `src/index.njk`, `src/meal-plan.njk`, `src/shopping-list.njk`: public pages. Meal plan and shopping list currently show explicit placeholders.

Eleventy is the only direct development dependency. Its Nunjucks support avoids a separate template package. No runtime dependencies, framework, database, or bundler are needed.

## Planned data flow

Separate recipe and ingredient JSON files will be the source of truth. Build-time validation will reject unknown ingredient IDs and invalid data before generating recipe HTML. A Nunjucks template will also generate a compact static JSON endpoint with recipe summaries and ingredient quantities, omitting instructions. Pages needing client data can fetch that endpoint; the complete catalogue will not be embedded in every HTML page.

Browser ES modules will keep storage, selection, DOM rendering, and pure aggregation separate. localStorage will store recipe IDs, serving counts, and purchased-item state, with graceful handling of unavailable or invalid storage. Shopping totals will normalise kg to g and L to ml, then group by ingredient ID and compatible unit; incompatible measurements remain separate. Ingredient categories come from the catalogue so more categories can be added later.

Internal links use Eleventy’s `url` filter to support a future deployment path prefix. Deployment configuration will be added in Phase 6.

## Next phases

2. Add a central ingredient catalogue and five realistic recipes, validate references, generate listing and detail pages, and style responsive recipe cards.
3. Add selection, the meal plan interface, and localStorage persistence.
4. Add pure aggregation, compatible unit conversion, category groups, and the shopping list interface.
5. Add serving controls, search/filter, purchased checkboxes, clipboard support, and accessibility refinements.
6. Test aggregation using Node’s built-in test runner, review accessibility and performance, and prepare deployment.

Proceed to Phase 2 only after approval.
