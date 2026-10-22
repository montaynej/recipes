# Everyday Table

An incremental Eleventy recipe website. Phases 1 and 2 provide the static site foundation, five sample recipes, a central ingredient catalogue, validated data, responsive cards, and generated recipe detail pages. Interactive features are deferred.

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
- `src/_data/`: shared build-time data. `site.json` holds the site identity; `recipes.json` and `ingredients.json` supply the recipe collection and central catalogue.
- `src/_includes/layouts/`: shared document layout.
- `src/_includes/components/`: reusable navigation and footer; recipe cards, metadata, and ingredient lists; shopping components will follow.
- `src/recipes/`: `recipe.njk` generates one page per recipe using Eleventy pagination.
- `src/css/`, `src/js/`, `src/images/`: static assets, copied without bundling. Empty directories contain `.gitkeep` files.
- `src/index.njk`, `src/meal-plan.njk`, `src/shopping-list.njk`: public pages. Meal plan and shopping list currently show explicit placeholders.

Eleventy is the only direct development dependency. Its Nunjucks support avoids a separate template package. No runtime dependencies, framework, database, or bundler are needed.

## Planned data flow

Separate recipe and ingredient JSON files are the source of truth. `lib/validate-recipes.js` runs before every build and rejects unknown ingredient IDs, duplicate recipe IDs, invalid quantities, unsupported units, and missing required fields before generating recipe HTML. A Nunjucks template will also generate a compact static JSON endpoint with recipe summaries and ingredient quantities, omitting instructions. Pages needing client data can fetch that endpoint; the complete catalogue will not be embedded in every HTML page.

Browser ES modules will keep storage, selection, DOM rendering, and pure aggregation separate. localStorage will store recipe IDs, serving counts, and purchased-item state, with graceful handling of unavailable or invalid storage. Shopping totals will normalise kg to g and L to ml, then group by ingredient ID and compatible unit; incompatible measurements remain separate. Ingredient categories come from the catalogue so more categories can be added later.

Internal links use Eleventy’s `url` filter to support a future deployment path prefix. Deployment configuration will be added in Phase 6.

## Recipe content and images

Edit `src/_data/recipes.json` to add or change recipes. Each entry needs a unique URL-safe ID, title, description, category, servings, prep/cook times, image path and alternative text, ingredient quantities/units, and instructions. Ingredient IDs must exist in `src/_data/ingredients.json`; category names remain extensible. Supported units are `g`, `kg`, `ml`, `L`, `whole`, `tsp`, and `tbsp`.

The five sample recipes are banana and cinnamon porridge, spinach eggs on toast, chickpea and feta salad, tomato and spinach pasta, and coconut chicken curry. Shared ingredients will support aggregation in later phases.

Images are deliberately labelled local SVG placeholders, not food photographs. Replace them with photographs in `src/images/`, then update each recipe's `image` and `imageAlt`. Templates currently reserve an 800 × 560 aspect ratio. No image service or additional dependency is required.

Phase 2 verification: the production build generates eight HTML pages. Generated recipe links, ingredient names, image files, and validation rejection of unknown ingredients and duplicate IDs were checked. Visual browser and formal accessibility testing have not yet been performed.

## Next phases

3. Add selection, the meal plan interface, and localStorage persistence.
4. Add pure aggregation, compatible unit conversion, category groups, and the shopping list interface.
5. Add serving controls, search/filter, purchased checkboxes, clipboard support, and accessibility refinements.
6. Test aggregation using Node’s built-in test runner, review accessibility and performance, and prepare deployment.

Proceed to Phase 3 only after approval.
