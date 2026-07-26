# Changelog

All notable changes to Pool Pilot Dashboard are documented in this file.

The project follows semantic versioning where possible.

## [Unreleased]

### Planned

- Continue mobile compatibility and community testing.

## [1.2.3] - 2026-07-26

### Added

- Maintenance Mode control in Expert Mode.
- Pool-cover controls using a standard Home Assistant `cover` entity.
- Daily filtration progress directly in the Expert Mode “Cycle du jour” row.

### Changed

- Reduced chlorine/ORP value size to prevent mobile overflow.
- Improved treatment popup to display the actual recommendation and dosage.
- Pool-cover configuration is handled exclusively by the card.

### Fixed

- Missing recommendation details when no separate alert item was present.
- Filtration progress placement and display.
- Mobile chlorine/ORP gauge overflow.

## [1.2.2-beta]

### Added

- Initial Maintenance Mode, filtration progress and updated disinfection gauge.

## [1.2.1-beta]

### Added

- Card controls for automatic-filtration placement and authorized time window.

## [1.2.0-beta.1]

### Added

- History views for 24 hours, 7 days and 30 days.
- Simple and advanced electrolyzer display with optional Boost.
- ORP/free-chlorine presentation based on integration configuration.

## [1.1.1]

### Fixed

- Gauge alignment and HACS resource documentation.

## [1.0.1]

### Fixed

- Rendering with unavailable or non-numeric temperature values.
- Firefox compatibility issue affecting the card renderer.

## [1.0.0]

### Added

- First stable mobile-first Pool Pilot Dashboard release.
