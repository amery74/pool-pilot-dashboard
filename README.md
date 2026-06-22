# Pool Pilot Dashboard v0.29

Carte Lovelace Pool Pilot Dashboard.

## v0.29

Ajout du bloc météo avancé inspiré de Flipr :

- icône météo actuelle depuis l’entité `weather.xxx` ;
- icône météo à venir via `weather.get_forecasts` / API Home Assistant, avec fallback sur les attributs de l’entité météo ;
- indice UV conservé ;
- pastilles SVG de vigilance Météo-France :
  - vent violent ;
  - orages ;
  - pluie-inondation ;
  - canicule ;
  - neige-verglas ;
- niveaux pris en charge : jaune, orange, rouge ;
- aucune pastille affichée pour vigilance verte / aucune vigilance ;
- libellés de configuration clarifiés : les champs météo attendent une intégration météo type Météo-France.

## Installation HACS

Ajouter ce dépôt comme dépôt personnalisé HACS de type Tableau de bord / Lovelace, puis installer la carte.

Ressource attendue :

```yaml
url: /hacsfiles/pool-pilot-dashboard-card.js
 type: module
```


## v0.29 - Vigilance Météo-France

La carte utilise maintenant une seule entité de vigilance Météo-France, par exemple `sensor.74_weather_alert`.
Elle lit les attributs suivants : `Canicule`, `Vent violent`, `Pluie-inondation`, `Orages`, `Neige-verglas`.
Seuls les niveaux `Jaune`, `Orange` et `Rouge` affichent une pastille. Le niveau `Vert` est ignoré.


## v0.29

Correction du bloc météo :

- affichage `météo actuelle > météo à venir` ;
- utilisation de la même entité météo Météo-France `weather.xxx` ;
- récupération de la prévision via l’API météo Home Assistant ;
- conservation des pastilles vigilance Météo-France via le capteur unique `weather_alert`.
