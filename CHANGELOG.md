# Changelog

## v1.4.0

- Liaison automatique des entités créées par l’intégration Pool Pilot via le registre d’entités Home Assistant.
- Détection basée sur les `unique_id` Pool Pilot : les entités restent reconnues même si l’utilisateur les renomme dans Home Assistant.
- Les entités externes à Pool Pilot (pompe, PAC, électrolyseur physique, volet, éclairage, auxiliaires, météo, etc.) restent configurées manuellement par l’utilisateur.
- Une entité Pool Pilot renseignée explicitement dans la configuration de la carte reste prioritaire sur l’auto-détection.
- En présence de plusieurs instances Pool Pilot, la carte utilise une entité Pool Pilot explicitement configurée comme point d’ancrage ; sans point d’ancrage, aucune association arbitraire n’est effectuée.
- Auto-liaison des données d’analyse, alertes, filtration intelligente, Pool House, carnet d’entretien, bandelettes et réglages Pool Pilot.

## v1.3.2

- Restauration complète du Mode Maintenance dans le Mode Expert.
- Restauration de la bannière lorsque le Mode Maintenance est actif.
- Conservation des fonctions historiques de la carte v1.2.3 : historique, volet, électrolyseur avancé et réglages de filtration.
- Suppression du gros badge de traitement sur la vue principale.
- Affichage du traitement principal uniquement dans le Mode Expert.
- Compatibilité Chlore, Sel / électrolyse, Brome et Oxygène actif.
- Affichage de la valeur ORP / RedOx en mV dans la jauge.
- Restauration du réglage RedOx cible en mode ORP.

## 1.2.3

- Correctifs ciblés de la carte : Maintenance, jauge désinfection, progression de filtration et volet.
- Aucun changement de la structure générale de l’interface.

# Changelog

## 1.2.2-beta
- Mode Maintenance avec suspension des automatismes et maintien des mesures.
- Commande facultative du volet (ouvrir, arrêter, fermer, état et position).
- Progression quotidienne de filtration : réalisé, prévu, pourcentage et temps restant.
- Jauge ORP/chlore harmonisée avec la jauge pH.
- Boost électrolyseur utilisable en mode simple ou avancé.
- Enregistrement automatique des alertes et récapitulatifs dans le carnet.
- Amélioration du bouton de mesure, du logo central et de la stabilité du défilement.

# Changelog

## v1.2.1-beta

### Added
- Added controls for the automatic-filtration placement mode directly in the card settings.
- Added editable minimum start and maximum end times for window-based automatic filtration.
- Added automatic discovery and optional explicit configuration of the new `select` and `time` entities.

### Fixed
- The card now displays the central hour only in centered mode and the authorized time window only in window mode.
- Corrected the editor selector for the central filtration hour to use the `number` domain.

## v1.2.0-beta.1

### Added
- New History panel with 24-hour, 7-day and 30-day views.
- Temperature, pH and ORP/chlorine charts based on Home Assistant Recorder history.
- Simple or advanced electrolyzer display.
- Advanced electrolyzer production percentage and optional Boost control.
- Optional Pool Pilot disinfection-mode entity for automatic ORP/chlorine presentation.

### Fixed
- Registered both `pool-pilot-dashboard` and `pool-pilot-dashboard-card` custom element names.
- Preserved the page and container scroll positions during Home Assistant state refreshes.
- Improved compatibility with YAML and storage dashboards.


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
