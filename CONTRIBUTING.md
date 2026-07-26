# Contributing to Pool Pilot Dashboard

Thank you for helping improve the Pool Pilot interface.

## Before opening an issue

- Search existing issues.
- Test the latest stable card and integration versions.
- Include the relevant card configuration with private entity names removed if necessary.
- Use the provided issue form.

## Development rules

1. Fork the repository and create a focused branch.
2. Keep new equipment and features optional.
3. Preserve the established structure and navigation of the card.
4. Avoid regressions on mobile and tablet layouts.
5. Keep `pool-pilot-dashboard-card.js` and `dist/pool-pilot-dashboard-card.js` identical.
6. Update `CHANGELOG.md` under an **Unreleased** section when appropriate.

## Validation

Before submitting a pull request:

- run a JavaScript syntax check;
- test the card on mobile and desktop;
- test with missing or unavailable optional entities;
- reload Home Assistant and check the browser console;
- ensure HACS validation passes.
