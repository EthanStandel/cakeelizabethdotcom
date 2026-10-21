# cakeelizabeth.com

SolidStart site with an aggressively customized Decap CMS admin interface. Content is stored as Markdown files in `public/content/` and committed to the repo.

## Specs

The architecture, environment, and behavior of the project are documented in the specs. Each feature has a spec at `specs/NNN-feature-name/SPEC.md`. The specs are organized by feature, so a feature that spans the site and the admin has one spec. They are numbered in the order the features build on each other: reading them in order explains the project from the ground up, and none depends on a later one.

[`specs/GLOBAL_ACCEPTANCE_CRITERIA.md`](specs/GLOBAL_ACCEPTANCE_CRITERIA.md) holds the global acceptance criteria: the architectural decisions every feature in the main application must satisfy regardless of its own spec.

The conventions for writing specs are in [`specs/SPEC_CONVENTIONS.md`](specs/SPEC_CONVENTIONS.md). Claude is used to scaffold new specs; when it reads and updates them is in [CLAUDE.md](CLAUDE.md#specs).

## Dev

```bash
npm install
npm run dev
```

The processes this starts, their ports, and debugging are described in [000§4](specs/000-initial/SPEC.md#4-local-development).

## Build

```bash
npm run build
```

The build steps are described in [000§5](specs/000-initial/SPEC.md#5-build), and the environment variables a production build needs in [000§4.2](specs/000-initial/SPEC.md#42-environment-variables).

## Deploy

The site deploys to Vercel. Everything specific to Vercel is kept in [`vercel.json`](vercel.json).
