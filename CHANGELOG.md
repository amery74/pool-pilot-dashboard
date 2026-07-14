# Changelog

## v1.1.1

### Fixed
- pH and chlorine/ORP gauges now remain perfectly aligned.
- The numeric ppm/mV value no longer shifts the right gauge downward.
- Improved HACS resource troubleshooting documentation.
- Confirmed the HACS package filename and root-content configuration.


## v1.1.0-beta.1

### Added
- Numeric chlorine or ORP value below the gauge.
- Card-level selector for chlorine versus ORP display.
- Optional lighting, AUX1 and AUX2 controls.

### Fixed
- pH value formatting.
- Alert banner no longer appears without an actionable recommendation.
- “Water correction in progress” is hidden when no recommendation remains.


## v1.0.1

### Fixed
- Fixed Dashboard render crash when the main temperature value is empty, unavailable or non-numeric.
- Fixed `TypeError: this._fmt is not a function` reported on Firefox/Windows and Firefox/Linux.
- Prevented the Lovelace card editor from refreshing continuously due to this rendering error.

## v1.0.0

### Stable release
- First stable release of the Pool Pilot Dashboard Lovelace card.
- Polished mobile-first dashboard for Pool Pilot.
- Compatible with Pool Pilot v1.0.0.

### Features
- Main pool status dashboard.
- Water temperature, pH, chlorine and alert display.
- Pool House product management UI.
- Strip test entry and display.
- Notification settings UI.
- Smart filtration controls.

### Stability
- Fixed unsupported `twice_daily` weather forecast calls.
- Removed forced refresh of legacy strip-test entities.
- Improved compatibility with Home Assistant 2026.6+.

## v0.34.37
- Fixed strip test refresh warnings by removing refresh calls for legacy `sensor.piscine_*_bandelette` entities.
