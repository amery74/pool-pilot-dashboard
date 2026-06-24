# Pool Pilot Dashboard v0.30

Version adaptée à Pool Pilot v0.5.0 avec affichage de la **filtration auto intelligente** dans le Mode Expert.

## Nouveautés

- Le bouton auto reste destiné au switch Pool Pilot de filtration intelligente.
- Le Mode Expert affiche en bas :
  - mode auto intelligent ;
  - état du cycle ;
  - heures réalisées / heures prévues ;
  - plage autorisée ;
  - fin limite ;
  - prochaine programmation ;
  - détails du calcul.

## Configuration recommandée

Dans la carte :

- Commande manuelle pompe : switch de la pompe
- Filtration auto intelligente Pool Pilot : switch Pool Pilot auto
- Durée filtration recommandée : sensor Pool Pilot durée filtration recommandée



## v0.30.1

- Le bouton Auto de la carte pilote maintenant en priorité `switch.piscine_filtration_auto_intelligente`.
- Si l'ancien champ `pump_auto_entity` pointe vers `switch.piscine_filtration_automatique_pool_pilot`, la carte détecte automatiquement le nouveau switch intelligent correspondant.
- Ajout d'un champ optionnel `auto_schedule_entity` dans l'éditeur visuel.
- Suppression de la priorité donnée à l'état local du navigateur pour éviter un bouton vert alors que le moteur Auto Intelligent est désactivé.
