# Changelog

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
