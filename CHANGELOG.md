# Changelog

## [0.4.0] - 2026-09-20

### Fixed
- `Text` was given `color="secondary"`, which is not a value it takes — it renders the string as a CSS colour, so the helper text under each tab came out at full strength instead of secondary. It takes a token name: `color="--figma-color-text-secondary"`

### Changed
- The shape count is a `NumericInput` rather than a `Slider`, matching how number fields are built across the plugins that use this kit
- Success notifications say how to undo, as a plugin that creates several nodes at once should
- `code.ts` clamps the count to the range the UI offers (it allowed 20 where the field stopped at 5) — a message can say anything, so the sandbox side decides
- Tabs are declared as plain strings; the `id` each carried was never read

## [0.3.1] - 2026-05-13

### Fixed
- `onmessage` handler now wrapped in top-level `try/catch` so unhandled errors surface to the UI instead of silently hanging.
- Added `isLoading` guard to prevent double-dispatch on rapid button clicks.
- Action buttons use `ariaDisabled` + `Tooltip` to explain why they are unavailable.
- Empty text input is now validated client-side before dispatch.
- `Dropdown` missing `ariaLabel`; `Input` connected to `FieldGroup` label via `id`/`labelFor`.

### Changed
- Updated icon imports to use `figma-ui3-kit-svelte/icons` after the UI kit icon export restructure.
