# px

Small CLI for bookmarking local projects and jumping to them without hunting paths.

**What it does:** list and add/remove entries, fuzzy-match by name, optionally run `npm run dev` / `npm run start` from a project’s `package.json`, run arbitrary commands in a project directory, or open the folder in Cursor.

## Requirements

- **Node.js** and npm (build uses TypeScript).
- **`cursor`** on your `PATH` for `px edit` and when opening a project that has no `dev`/`start` script.
- **`PROJECTS_DIR`** must be set if you use `px add <name>` or `px mk <name>`.

## Install

From this repo:

```sh
npm install   # runs `prepare` → compile to dist/
npm link      # exposes the global `px` command
```

Rebuild after changes:

```sh
npm run build
```

## Configuration

| Variable        | Purpose |
|----------------|---------|
| `PROJECTS_DIR` | Root directory for named adds (`px add foo` → `PROJECTS_DIR/foo`) and for `px mk`. |

Saved projects live in **`px-state.json`** at the repo root (next to `package.json`).

## Commands

| Command | Description |
|---------|-------------|
| `px` | Interactive picker (number or name). |
| `px ls` | List saved projects (`l`, `list` work too). |
| `px add` | Add **current directory**; name defaults to the folder name. |
| `px add <name>` | Add `PROJECTS_DIR/<name>` (needs `PROJECTS_DIR`). |
| `px mk <name>` | Create `PROJECTS_DIR/<name>`, open it in Cursor, add to the list. |
| `px rm <name>` | Remove from the list (does not delete files). |
| `px edit <name>` | Open in Cursor. |
| `px <name>` | Fuzzy-match one project: run `npm run dev`, else `npm run start`, else open in Cursor. |
| `px <name> <cmd>` | Run `<cmd>` in that project’s directory (shell). |
| `px help` | Help (`?`, `-h`, `--help`). |

## Behavior notes

- **Fuzzy match:** substrings match; otherwise letters can appear in order across the name. If several projects match, pick a more specific query.
- **`px <name>` with no extra args:** if `package.json` has a `dev` script it runs that; otherwise `start`; if neither exists, opens the folder in Cursor.
