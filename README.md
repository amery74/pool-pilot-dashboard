# Dashboard Pool Pilot style Flipr

Modèle Lovelace inspiré de l'ergonomie Flipr, à coller dans un tableau de bord Home Assistant en mode YAML.

## Dépendances HACS recommandées

- Mushroom Cards
- Button Card
- Card Mod

## Entités à adapter

Remplace dans `dashboard-flipr-like.yaml` :

- `switch.pompe_filtration`
- `sensor.piscine_temperature_eau`
- `sensor.piscine_ph`
- `sensor.piscine_chlore_libre`
- `sensor.piscine_redox`
- `sensor.piscine_actions_recommandees`
- `sensor.temperature_exterieure`
- `sensor.uv_index`

## Installation rapide

1. Installer les dépendances via HACS.
2. Créer un nouveau tableau de bord YAML ou ouvrir l'éditeur de configuration brute.
3. Coller le contenu de `dashboard-flipr-like.yaml`.
4. Adapter les noms d'entités à ton installation.
