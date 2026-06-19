# Pool Pilot Dashboard v0.8.0

Corrections :
- retour/maintien du design Flipr-like v0.7 ;
- bandeau orange affiché uniquement si une vraie alerte chimie/baignade/produit est détectée ;
- formulaire Pool House enrichi avec dosage structuré : unité, volume de référence, quantité, variation pH, lieu de traitement, dosage choc et initial ;
- envoi des champs structurés au service `pool_pilot.add_product` avec compatibilité `dosage` texte.

Ressource HACS : `/hacsfiles/pool-pilot-dashboard/pool-pilot-dashboard-card.js`.


## v0.9
- Correction du bandeau orange : il n’apparaît plus sur les simples états `Bon`, `OK`, `normal`, ni sur les textes de filtration.
- Ajout d’une entité `alert_entity` optionnelle pour forcer l’affichage uniquement depuis une alerte Pool Pilot dédiée.
- Le bandeau s’affiche seulement si pH/Chlore/RedOx est hors plage ou si une action produit explicite est détectée.


## v0.11
- Correction du bug de fermeture des champs pendant la saisie dans l’éditeur visuel et le Pool House.
- Le rendu est suspendu pendant la saisie pour éviter la perte de focus.
