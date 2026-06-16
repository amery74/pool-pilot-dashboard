# Pool Pilot Dashboard v0.6.0

Carte Lovelace HACS inspirée de Flipr pour Pool Pilot.

## Nouveautés v0.6

- Page **Pool House** pour afficher les stocks de produits chimiques.
- Champ d'éditeur visuel `Produits Pool House` : entrer les entités de stock séparées par des virgules.
- Corrections v0.5 incluses :
  - bandeau alerte masqué quand tout va bien ;
  - “Plus tard” masque l’alerte 6 h ;
  - “C’est fait” valide l’action et masque l’alerte 24 h ;
  - jauge pH avec point blanc et trait noir synchronisés ;
  - jauge chlore/RedOx horizontale ;
  - filtration ON/OFF + Auto recommandé ;
  - PAC mode chauffage/auto/refroidissement + consigne.

## Ressource

```text
/hacsfiles/pool-pilot-dashboard/pool-pilot-dashboard-card.js
```

Type : Module JavaScript.

## Exemple YAML minimal

```yaml
type: custom:pool-pilot-dashboard
title: Piscine
water_temp_entity: sensor.flipr_temperature
ph_entity: sensor.flipr_ph
orp_entity: sensor.flipr_orp
last_measure_entity: sensor.flipr_last_measure
trigger_measure_entity: button.flipr_request_measure
enable_filter_pump: true
pump_entity: switch.pompe_piscine
pump_auto_entity: button.pool_pilot_filtration_auto
enable_heatpump: true
heatpump_entity: climate.pac_piscine
enable_pool_house: true
product_entities: sensor.pool_pilot_ph_moins_stock, sensor.pool_pilot_chlore_galets_stock
```
