# Pool Pilot Dashboard

Carte Lovelace inspirée de Flipr pour Home Assistant.

## Installation HACS

1. Dans HACS > Dépôts personnalisés, ajoute le dépôt GitHub.
2. Type : **Plugin** / **Frontend**.
3. Installe le plugin.
4. Vide le cache navigateur ou recharge complètement l'application Home Assistant.

## Ressource Lovelace

HACS devrait ajouter la ressource automatiquement. Si ce n'est pas le cas, ajoute manuellement :

```text
/hacsfiles/pool-pilot-dashboard/pool-pilot-dashboard-card.js
```

Type : **Module JavaScript**.

Si ton dépôt GitHub s'appelle autrement, adapte le dossier :

```text
/hacsfiles/NOM_DU_DEPOT/pool-pilot-dashboard-card.js
```

Exemple si le repo s'appelle `pool-pilot-dashboard-hacs-ui` :

```text
/hacsfiles/pool-pilot-dashboard-hacs-ui/pool-pilot-dashboard-card.js
```

## Utilisation graphique

Après installation et ressource chargée :

1. Modifie un tableau de bord.
2. Ajoute une carte.
3. Cherche **Pool Pilot Dashboard**.
4. Configure les entités dans l'éditeur graphique.

## Test manuel

```yaml
type: custom:pool-pilot-dashboard
```

Si Home Assistant affiche `Custom element not found`, la ressource JavaScript n'est pas chargée ou le chemin est incorrect.

## Configuration complète possible

```yaml
type: custom:pool-pilot-dashboard
title: Piscine
water_temp_entity: sensor.piscine_temperature_eau
air_temp_entity: sensor.temperature_exterieure
ph_entity: sensor.piscine_ph
chlorine_entity: sensor.piscine_chlore_libre
orp_entity: sensor.piscine_redox
uv_entity: sensor.uv
pump_entity: switch.pompe_piscine
heatpump_entity: climate.pac_piscine
weather_entity: weather.maison
filtration_duration_entity: sensor.piscine_duree_filtration_recommandee
bathing_state_entity: sensor.piscine_etat_baignade
chemistry_state_entity: sensor.piscine_etat_chimie
actions_entity: sensor.piscine_actions_recommandees
show_controls: true
show_weather: true
show_recommendations: true
theme: flipr
```
