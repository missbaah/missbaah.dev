# missbaah.dev

Personal portfolio site: an Astro app that showcases projects, each rendered as a card that opens a detail dialog.

## Language

**Project Status**:
A project is either `done` or `in progress`. It is purely informational — it does not gate interactivity. A project card is equally clickable and opens the same dialog regardless of status.
_Avoid_: assuming "in progress" implies disabled, unfinished, or non-interactive.

**Featured vs Status**:
`featured` and `status` are independent flags on a project and serve different pages. `featured` is a homepage curation flag — it controls which projects appear on the homepage — and has no meaning on the Projects page. `status` (`done` / `in progress`) is what the Projects page groups and filters by; it ignores `featured` entirely.
_Avoid_: using `featured` to decide what shows on the Projects page, or `status` to decide what shows on the homepage.

**Featured is a singleton**:
Exactly one project has `featured: true` at any time — it's the homepage's spotlighted project, rendered as a large hero card. Every other project appears in the homepage's "Also live" grid, regardless of `status`. This is a hand-kept convention in `project.ts`, not runtime-enforced.
_Avoid_: setting more than one project's `featured` to `true`, or reading "Also live" as filtered by `status`.

**Also live**:
The homepage section listing every project other than the one spotlighted in Featured. Named for the fact that most of the author's work is shipped, not for a `status` filter — an `in progress` project still shows up here.
_Avoid_: assuming "live" means `status: "done"`.
