# Météo

La météo de ta ville ou de n'importe quelle autre : le temps qu'il fait maintenant, les 36 prochaines heures en courbe, les prévisions sur 10 jours et la qualité de l'air.

*English version: [README.en.md](README.en.md)*

## Maintenant

En haut, le temps actuel : une icône (ensoleillé, éclaircies, couvert, brouillard, pluie, neige, orage, de jour ou de nuit), la température et le **ressenti**, puis le détail :

- **vent** (vitesse, direction et rafales), **humidité**, **pression**, **nuages** ;
- **indice UV**, **soleil** (lever et coucher) ;
- **qualité de l'air** selon l'indice européen, de « Très bon » à « Très mauvais », avec sa valeur ;
- **pluie** tombée ou prévue sur 24 h.

## Les 36 prochaines heures

Un graphique montre la **température** en ligne et le **risque de pluie** en barres. Survole-le pour le détail de chaque heure.

## 10 jours

Une ligne par jour : l'icône, les températures minimale et maximale sur une barre commune (pour comparer les jours d'un coup d'œil), le risque et la quantité de pluie, et le vent. Survole un jour pour voir le lever et le coucher du soleil et l'UV maximal.

## Choisir la ville

- **Ma ville** affiche la ville réglée dans Paramètres de NeoDex.
- **Autre ville…** : tape un nom puis **Entrée** pour voir la météo d'ailleurs, sans changer ta ville.

## Données et synchronisation

Les prévisions et la qualité de l'air viennent d'**Open-Meteo**, service libre et sans compte ; ce sont les seuls sites contactés. Tes villes sont enregistrées par NeoDex, sauvegardées et synchronisées entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Météo → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
