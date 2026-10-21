# Spec conventions

How every feature spec is written. The conventions are stated here once and not repeated in the specs: anything that describes how specs in general are written (path style, level of detail, how specs reference each other) belongs in this file, never inside a spec or the README. When to read a spec and when to update one is in [CLAUDE.md](../CLAUDE.md#specs).

## Location

A feature spec lives at `specs/NNN-feature-name/SPEC.md`, and a new feature gets a new spec under the next number. Specs are organized by feature, not by directory: a feature `SPEC.md` never goes inside `src/`, `admin/` or `scripts/` or at the repository root.

The layout follows [spec-kit](https://github.com/github/spec-kit)'s numbered feature folders, with `SPEC.md` in place of spec-kit's lowercase `spec.md`.

## Conventions

- **Header.** It opens with its status, the specs it depends on, and the date and commit it was last checked against.
- **Body.** It describes behavior and the reasons behind it. Coding conventions stay in [CLAUDE.md](../CLAUDE.md#code-conventions).
- **Paths.** They are written from the repository root. Once a file has been given with its full path, or a table or section is headed with a directory, the bare name is used after that.
- **Visual detail.** A spec gives the values that define the look: tokens, type scale, and each component and module's dimensions. It uses Tailwind's names (`text-5xl`, `px-6`) where the code does. It does not reproduce every class string; where a spec is silent on a detail, the component file is the reference.
- **Shared files.** A file is described in the spec of the feature that introduces it. When a later feature adds to that file or changes it, the later spec describes the change. The earlier spec is left as it was written: a spec records the decisions of its own feature and is not rewritten to follow later ones.
- **Cross-references.** A spec links to another by number or name, and only to a spec numbered before it: an earlier spec never references a later one. The table in [README.md](../README.md#specs) is the only index; a spec does not point back to it.
- **Section references.** A section is cited as `§` and its number, and every such citation is a link to that heading's anchor. Within a spec the link text is the section alone: `[§9.6](#96-click-to-edit-focusing-the-editor-field)`. Into another spec it is that spec's number followed directly by the section, with no space between them: `[000§13.2](../000-initial/SPEC.md#132-modules)`. Never leave a `§N` unlinked. Point the link at a heading that exists, and when a heading is renamed or renumbered, update every link that targets it.
- **Global acceptance criteria references.** A criterion in [GLOBAL_ACCEPTANCE_CRITERIA.md](GLOBAL_ACCEPTANCE_CRITERIA.md) is cited as `GAC§` and its number, linked like any other section reference: `[GAC§3](../GLOBAL_ACCEPTANCE_CRITERIA.md)`. The criteria are a numbered list with no heading anchors, so the link targets the file. Cite a criterion only where a technical decision was made to satisfy it; a spec does not list the criteria it merely complies with.
- **Known gaps.** A spec with known gaps ends with a "Known gaps" section: things that are wrong or missing in what exists, as opposed to work not yet started. A spec with none leaves the section out.
- **Accepted gaps.** A known gap the owner decides not to fix moves from "Known gaps" to an "Accepted gaps" section after it, so that "Known gaps" lists only what is still meant to be fixed. The entry keeps its text and adds the date it was accepted and why, as a closing sentence of the form "_Accepted 2026-10-20:_ the reason." Only the owner accepts a gap; a gap is never moved there on a contributor's own judgment. An accepted gap that starts to matter moves back to "Known gaps" with its acceptance removed. A spec with none leaves the section out.
- **Awaiting deployment.** Something that can only be done or checked against the live site ends with "_Awaits deployment:_" and what to do once the site is live, so that `grep -rn "Awaits deployment" specs` lists everything a launch still owes. In a list of tasks it is a sub-item of the task. When it is done, the marker is replaced by the result and its date.
