# Pool Pilot Dashboard v0.16

Dashboard compatible avec Pool Pilot v0.3.0.

## Nouveautés

- Le bouton automatique `ϟ A` peut piloter directement le service `pool_pilot.toggle_auto_schedule` si aucun interrupteur/bouton n’est renseigné.
- Champ conseillé : sélectionner le switch **Filtration auto planifiée** de Pool Pilot dans `Interrupteur auto Pool Pilot ou bouton filtration automatique`.
- La pompe reste une seule entité on/off : le bouton manuel bascule cette entité, le bouton `ϟ A` active/désactive le planning Pool Pilot.


### Pool House

Cette build v0.16 ajoute l’édition/suppression Pool House : la croix bleue appelle `pool_pilot.remove_product`, le stylo ouvre le formulaire pré-rempli et sauvegarde avec `pool_pilot.update_product`.
