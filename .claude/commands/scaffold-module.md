# Scaffold Module

Read README.md and the existing modules in `src/modules/` and `src/models/modules/` to orient yourself before starting.

The user wants to scaffold a new module named: **$ARGUMENTS**

## Step 1 — Ask clarifying questions

Before writing any code, ask the user:

1. **Container or leaf?** Can this module hold other modules (like `GridModule`), or is it a standalone leaf (like `HeroModule`)?
2. **Data fields** — Based on any screenshot or description provided, propose a concrete field list and ask the user to confirm or correct it before proceeding.

Do NOT write any code until the user confirms.

## Step 2 — Write the shape file

`src/models/modules/{ModuleName}Module.shape.ts`

## Step 3 — Register the shape

- Leaf module → `src/models/BaseModuleRegistry.shape.ts`
- Container module → `src/models/ModuleRegistry.shape.ts`

## Step 4 — Write the component

`src/modules/{ModuleName}Module.tsx`

Avoid any extraneous layout HTML or styling. Just organize the data and display it all in order. Utilize existing components, but avoid any unnecessary HTML elements or classes. Some basic styling to properly identify certain elements or pieces of content is permitted.

## Step 5 — Register the component

Add to `src/modules/ModuleRegistry.tsx`.
