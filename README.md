# AI Health Management Homepage

Static deliverable for the AI health management mini-app homepage.

## Files

- `index.html`: page structure
- `styles.css`: visual design and responsive layout
- `app.js`: homepage state switching and quick task menu behavior
- `AGENTS.md`: project implementation and Figma design guidelines

## Preview

Double-click `open-preview.bat` on Windows to start the Node preview service at `http://127.0.0.1:8767/`.

Use `node serve-mobile-preview.mjs --static-only --port=8768` to verify the read-only static deployment fallback locally.

The Node preview service provides full note editing and persistence. A static deployment can still display the project note snapshot, but remains read-only.

## Interface notes

- The floating toolbar is available on every C-end page, detail view, sheet, and dialog.
- Notes are hidden by default whenever the user enters a different interface; users can reveal them explicitly or enter placement mode through “添加备注”.
- Active overlays are detected independently of their mask implementation, so newly added sheets and dialogs should use the existing `active` visibility convention.
- Notes are isolated by `projectId` and `pageId`.
- Create, edit, drag, and delete operations write through `/api/ui-notes`.
- Data is stored in the server-side SQLite database at `data/ui-notes.sqlite`.
- Every note mutation also refreshes the checked-in project snapshot at `data/ui-notes-seed.json`.
- A new online server automatically imports `data/ui-notes-seed.json` into an empty SQLite database on first startup.
- Static online links fall back to `data/ui-notes-seed.json`, so saved notes remain visible even when no Node API is available.
- Deleted notes are soft-deleted so note numbers preserve creation order.
- The frontend does not store note data in LocalStorage.

For editable online sharing, deploy `serve-mobile-preview.mjs` on a Node.js host with a persistent writable disk. For view-only sharing, deploy the complete project including `data/ui-notes-seed.json` on any static host.
