# Pool Pilot Dashboard

Carte Lovelace inspirée de Flipr pour Home Assistant.

## Installation HACS

1. Publier ce dossier dans un dépôt GitHub, par exemple `amery74/pool-pilot-dashboard`.
2. Dans HACS > Dépôts personnalisés, ajouter l'URL du dépôt.
3. Type : **Plugin**.
4. Installer puis vider le cache navigateur / recharger l'application Home Assistant.

## Utilisation via interface graphique

Après installation :

1. Modifier un tableau de bord.
2. Ajouter une carte.
3. Chercher **Pool Pilot Dashboard**.
4. Sélectionner les entités dans l'éditeur graphique.

## Configuration YAML possible

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

## Entités conseillées

- `water_temp_entity` : température eau Flipr / Pool Pilot
- `ph_entity` : pH
- `chlorine_entity` ou `orp_entity` : chlore/RedOx
- `pump_entity` : switch pompe filtration
- `heatpump_entity` : switch/climate PAC
- `weather_entity` : Météo France
- `filtration_duration_entity` : durée de filtration Pool Pilot
- `actions_entity` : recommandations Pool Pilot

## Notes

Cette carte est un plugin Lovelace frontend. Elle ne remplace pas l'intégration `pool_pilot`; elle l'affiche.
