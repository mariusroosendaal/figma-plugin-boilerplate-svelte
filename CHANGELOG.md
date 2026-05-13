# Changelog

## [0.3.1] - 2026-05-13

### Fixed
- `onmessage` handler now wrapped in top-level `try/catch` so unhandled errors surface to the UI instead of silently hanging.
- Added `isLoading` guard to prevent double-dispatch on rapid button clicks.
- Action buttons use `ariaDisabled` + `Tooltip` to explain why they are unavailable.
- Empty text input is now validated client-side before dispatch.
- `Dropdown` missing `ariaLabel`; `Input` connected to `FieldGroup` label via `id`/`labelFor`.

### Changed
- Updated icon imports to use `figma-ui3-kit-svelte/icons` after the UI kit icon export restructure.
