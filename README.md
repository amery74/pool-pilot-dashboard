# Pool Pilot Dashboard v0.20

Version centrée sur le menu, sans modifier l'interface principale.

## Menu
- Carnet d'entretien : conservé pour la future timeline
- Pool House : gestion produits
- Mode Expert : données brutes + test bandelette + diagnostic
- Paramètres : conservé pour plus tard

## Mode Expert
Le formulaire Test bandelette envoie les valeurs à `pool_pilot.update_strip_test` :
- pH
- TAC
- TH
- Stabilisant
- Chlore libre
- Chlore total
- Température

Configure dans l'éditeur visuel :
- `Données brutes Pool Pilot` -> capteur `raw_measurements`
- `Test bandelette Pool Pilot` -> capteur `strip_test`
- `Entité météo` -> ton `weather.xxx`
