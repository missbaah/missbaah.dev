# missbaah.dev

Personal portfolio site: an Astro app that showcases projects, each rendered as a card that opens a detail dialog.

## Language

**Project Status**:
A project is either `done` or `in progress`. It is purely informational — it does not gate interactivity. A project card is equally clickable and opens the same dialog regardless of status.
_Avoid_: assuming "in progress" implies disabled, unfinished, or non-interactive.

**Featured vs Status**:
`featured` and `status` are independent flags on a project and serve different pages. `featured` is a homepage curation flag — it controls which projects appear in the homepage's preview grid and has no meaning on the Projects page. `status` (`done` / `in progress`) is what the Projects page groups and filters by; it ignores `featured` entirely.
_Avoid_: using `featured` to decide what shows on the Projects page, or `status` to decide what shows on the homepage.
