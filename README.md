# 🏊 Pool Pilot Dashboard

<p align="center">
  <b>Une carte Lovelace moderne pour piloter, surveiller et entretenir votre piscine dans Home Assistant.</b><br>
  Inspirée de l'expérience Flipr, avec une intégration poussée de Pool Pilot, Flipr Local et Météo-France.
</p>

<p align="center">
  <img alt="Home Assistant" src="https://img.shields.io/badge/Home%20Assistant-Custom%20Card-41BDF5?logo=home-assistant&logoColor=white">
  <img alt="HACS" src="https://img.shields.io/badge/HACS-Dashboard-orange">
  <img alt="Version" src="https://img.shields.io/badge/version-v0.28-blue">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
</p>

---

## ✨ Pourquoi Pool Pilot Dashboard ?

Pool Pilot Dashboard transforme Home Assistant en véritable centre de contrôle piscine.

L'objectif est simple : regrouper dans une interface mobile claire et agréable :

- l'analyse de l'eau ;
- la filtration ;
- la pompe à chaleur ;
- les équipements auxiliaires ;
- les recommandations de traitement ;
- les vigilances météo ;
- le Pool House ;
- le mode expert.

---

## 📸 Captures d'écran

Ajoutez vos captures dans `docs/screenshots/` avec les noms suivants :

```text
dashboard-home.png
dashboard-control.png
pool-house.png
expert-mode.png
strip-test.png
alerts.png
```

Puis elles s'afficheront ici :

### Dashboard principal

![Dashboard principal](docs/screenshots/dashboard-home.png)

### Contrôle des équipements

![Contrôle](docs/screenshots/dashboard-control.png)

### Pool House

![Pool House](docs/screenshots/pool-house.png)

### Mode Expert

![Mode Expert](docs/screenshots/expert-mode.png)

### Test bandelette

![Test bandelette](docs/screenshots/strip-test.png)

### Alertes

![Alertes](docs/screenshots/alerts.png)

---

## 🚀 Fonctionnalités principales

### Analyse de l'eau

- Température de l'eau
- Température extérieure
- pH
- Chlore / ORP
- Dernière mesure Flipr
- Déclenchement d'une mesure Flipr

### Bandeaux d'état

La carte affiche un bandeau dynamique selon l'état du bassin :

| État | Affichage |
|---|---|
| Tout est bon | `♡ Tout est parfait, bravo !` |
| Vigilance | `Vigilance en cours` |
| Alerte | `Alerte en cours : suivez nos conseils` |
| Correction | `Correction de l'eau en cours` |
| Report | `Vous avez reporté vos alertes` |

La logique s'appuie sur les entités de synthèse de Pool Pilot :

- État chimie
- État baignade
- Alerte Pool Pilot

### Contrôle

- Pompe filtration manuelle
- Filtration automatique Pool Pilot
- Pompe à chaleur
- Électrolyseur
- Nage à contre-courant
- Équipements optionnels configurables

### Pool House

- Ajout de produits
- Modification
- Suppression
- Gestion du stock
- Dosage détaillé

### Mode Expert

- Données brutes
- Diagnostic
- Test bandelette manuel
- Valeurs TAC / TH / stabilisant

### Météo-France

La carte peut afficher :

- météo actuelle ;
- météo à venir ;
- UV ;
- vigilances Météo-France.

Une seule entité `weather_alert` est nécessaire. La carte lit ses attributs :

- `Vent violent`
- `Orages`
- `Pluie-inondation`
- `Canicule`
- `Neige-verglas`

Niveaux affichés :

- jaune ;
- orange ;
- rouge.

---

## 📦 Installation via HACS

1. Ouvrir HACS.
2. Aller dans **Tableau de bord**.
3. Ajouter ce dépôt comme dépôt personnalisé.
4. Installer **Pool Pilot Dashboard**.
5. Redémarrer Home Assistant ou vider le cache navigateur.
6. Ajouter la carte dans Lovelace.

Ressource attendue :

```text
/hacsfiles/pool-pilot-dashboard/pool-pilot-dashboard-card.js
```

Type :

```text
Module JavaScript
```

---

## ⚙️ Exemple YAML minimal

```yaml
type: custom:pool-pilot-dashboard
water_temp_entity: sensor.flipr_temperature
ph_entity: sensor.flipr_ph
orp_entity: sensor.flipr_orp
last_measure_entity: sensor.flipr_last_measure
measure_button_entity: button.flipr_update
pump_entity: switch.pompe_piscine
auto_filtration_entity: switch.pool_pilot_filtration_auto
recommended_filtration_entity: sensor.pool_pilot_duree_filtration_recommandee
chemistry_state_entity: sensor.pool_pilot_etat_chimie
swim_state_entity: sensor.pool_pilot_etat_baignade
pool_alert_entity: sensor.pool_pilot_alerte
weather_entity: weather.maison
weather_alert_entity: sensor.meteo_france_weather_alert
uv_entity: sensor.uv
```

---

## 🔧 Configuration recommandée

### Entités Flipr / qualité eau

| Champ | Exemple |
|---|---|
| Température eau | `sensor.flipr_temperature` |
| pH | `sensor.flipr_ph` |
| ORP / chlore | `sensor.flipr_orp` |
| Dernière mesure | `sensor.flipr_last_measure` |
| Bouton mesure | `button.flipr_update` |

### Entités Pool Pilot

| Champ | Exemple |
|---|---|
| Durée filtration recommandée | `sensor.pool_pilot_duree_filtration_recommandee` |
| Filtration automatique | `switch.pool_pilot_filtration_auto` |
| État chimie | `sensor.pool_pilot_etat_chimie` |
| État baignade | `sensor.pool_pilot_etat_baignade` |
| Alerte Pool Pilot | `sensor.pool_pilot_alerte` |
| Pool House | `sensor.pool_pilot_pool_house` |

### Entités Météo-France

| Champ | Exemple |
|---|---|
| Météo | `weather.maison` |
| Vigilance Météo-France | `sensor.meteo_france_weather_alert` |
| UV | `sensor.uv` |

---

## 🗺️ Roadmap

### v0.29

- Historique graphique pH / ORP / température
- Amélioration des tendances
- Affichage des dernières analyses

### v0.30

- Carnet d'entretien
- Timeline des actions
- Historique des produits ajoutés

### v1.0

- Version stabilisée
- Documentation complète
- Support multi-piscines

---

## 🙏 Crédits

Ce projet s'appuie sur l'écosystème Home Assistant et s'inspire de l'expérience utilisateur de Flipr.

Merci à la communauté Home Assistant pour les tests, idées et retours.

---

## ⭐ Soutenir le projet

Si le projet vous plaît :

- ajoutez une étoile sur GitHub ;
- partagez vos retours ;
- proposez des améliorations ;
- ouvrez des issues en cas de bug.

**Pool Pilot Dashboard — votre piscine, enfin pilotée depuis Home Assistant.**
