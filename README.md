# Everyday Table

An incremental Eleventy recipe website. Phases 1–4 provide the static site foundation, five sample recipes, a central ingredient catalogue, validated data, responsive cards, generated recipe detail pages, recipe selection, a saved meal plan, and a consolidated shopping list. Serving controls, purchased-item checkboxes, and copying are deferred.

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
- `src/_includes/components/`: reusable navigation and footer; recipe cards, metadata, ingredient lists, and the shopping-list interface.
- `src/recipes/`: `recipe.njk` generates one page per recipe using Eleventy pagination.
- `src/css/`, `src/js/`, `src/images/`: static assets, copied without bundling. Empty directories contain `.gitkeep` files.
- `src/index.njk`, `src/meal-plan.njk`, `src/shopping-list.njk`: public pages. Meal Plan shows selected recipes using browser modules; Shopping List groups their combined ingredients.

Eleventy is the only direct development dependency. Its Nunjucks support avoids a separate template package. No runtime dependencies, framework, database, or bundler are needed.

## Planned data flow

Separate recipe and ingredient JSON files are the source of truth. `lib/validate-recipes.js` runs before every build and rejects unknown ingredient IDs, duplicate recipe IDs, invalid quantities, unsupported units, and missing required fields before generating recipe HTML. `src/shopping-data.njk` generates `/data/shopping.json`, containing recipe IDs, original servings, ingredient quantities/units, and the ingredient catalogue. It omits titles, descriptions, images, and cooking instructions. Only the shopping-list page fetches it, and only when recipes are selected; the full dataset is not embedded in HTML.

Browser ES modules separate storage (`storage.js`), selection state and meal-plan rendering (`meal-plan.js`), and page controls (`recipes.js`). localStorage currently stores a versioned list of recipe IDs under `everyday-table:meal-plan:v1`. Serving counts and purchased-item state will be introduced in later phases. Shopping totals normalise kg to g and L to ml, then group by ingredient ID and compatible unit; incompatible measurements remain separate. Ingredient categories come from the catalogue so more categories can be added later.

Internal links use Eleventy’s `url` filter to support a future deployment path prefix. Deployment configuration will be added in Phase 6.

## Recipe content and images

Edit `src/_data/recipes.json` to add or change recipes. Each entry needs a unique URL-safe ID, title, description, category, servings, prep/cook times, image path and alternative text, ingredient quantities/units, and instructions. Ingredient IDs must exist in `src/_data/ingredients.json`; category names remain extensible. Supported units are `g`, `kg`, `ml`, `L`, `whole`, `tsp`, and `tbsp`.

The five sample recipes are banana and cinnamon porridge, spinach eggs on toast, chickpea and feta salad, tomato and spinach pasta, and coconut chicken curry. Shared ingredients will support aggregation in later phases.

Images are deliberately labelled local SVG placeholders, not food photographs. Replace them with photographs in `src/images/`, then update each recipe's `image` and `imageAlt`. Templates currently reserve an 800 × 560 aspect ratio. No image service or additional dependency is required.

Phase 2 verification: the production build generates eight HTML pages. Generated recipe links, ingredient names, image files, and validation rejection of unknown ingredients and duplicate IDs were checked. Visual browser and formal accessibility testing have not yet been performed.

## Using the meal plan

Select **Add to meal plan** on any recipe card or detail page. The button changes to **Remove from meal plan**, and the navigation count updates. Open **Meal plan** to see selected recipes and remove them. The count measures recipes, not servings.

Selections are saved in this browser on this site, with no account. They restore after reload or reopening and synchronise between open tabs. Local development and a hosted site have separate storage. Clearing browser data removes the saved plan.

If saved data is malformed or storage is blocked/full, a visible message explains the issue. Selection still works in memory for the current page; unsaved changes cannot survive navigation or reload. Unknown recipe IDs are ignored, and duplicates are removed. With JavaScript disabled, recipe content stays available and the Meal Plan page explains that JavaScript is required.

Only recipe IDs are embedded globally. The Meal Plan page reuses build-time recipe cards and shows the selected cards; no runtime data endpoint is needed in Phase 3. The Shopping List page fetches the compact static JSON endpoint added in Phase 4.

Phase 3 checks: production build, JavaScript syntax checks, add/remove and restore logic, stale/duplicate IDs, malformed and unsupported storage versions, blocked reads, failed writes, generated meal-plan markup, and copied module assets passed. Visual browser, assistive-technology, and end-to-end interaction checks remain outstanding.

## Using the shopping list

Add recipes to your meal plan, then open **Shopping list** from the navigation or Meal Plan page. Ingredients are combined by catalogue ID and compatible unit, sorted by name, and grouped into Fresh and Stock. Categories are read from the catalogue, so additional categories can be displayed without changing the renderer.

`src/js/shopping-list.js` exports the pure function `aggregateIngredients(recipes, catalogue, selectedIds, servingsById = {})`. It deduplicates selected IDs, combines kg/g and L/ml quantities, and keeps incompatible units separate. Grams are not converted to whole items; teaspoon and tablespoon measurements remain separate too. Invalid recipe IDs, ingredient references, quantities, servings, and unsupported units throw clear errors rather than producing partial totals. The optional serving overrides support future controls; the current interface uses original recipe servings.

`src/js/shopping-list-ui.js` handles lazy data loading, grouping, number formatting, empty/loading/error states, retrying, and accessible status messages. Selection changes refresh the shopping list, including updates from another tab. The existing localStorage format is unchanged. Network/data errors show a message rather than an incomplete list.

Phase 4 verification passed: build and module syntax; static endpoint contents; single/multiple recipes, duplicate IDs, removal, empty plans, serving overrides, kg/g and L/ml conversion, incompatible units, invalid references, quantity formatting, and input immutability. A lightweight DOM adapter also checked category rendering, loading, the latest selection during an in-flight request, failure, and retry. These checks do not replace browser visual or assistive-technology testing, which remain outstanding. A retained automated test suite is still planned for Phase 6.

## Next phases

5. Add serving controls, search/filter, purchased checkboxes, clipboard support, and accessibility refinements.
6. Test aggregation using Node’s built-in test runner, review accessibility and performance, and prepare deployment.

Proceed to Phase 5 only after approval.
