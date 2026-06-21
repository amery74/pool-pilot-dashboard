# Pool Pilot Dashboard v0.28

Carte Lovelace Pool Pilot Dashboard.

## v0.28

Ajout du bloc météo avancé inspiré de Flipr :

- icône météo actuelle depuis l’entité `weather.xxx` ;
- icône météo à venir si la prévision est disponible dans l’entité météo ;
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
