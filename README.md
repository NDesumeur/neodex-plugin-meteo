# Météo

La météo de ta ville ou de n'importe quelle autre : le temps qu'il fait maintenant, les 36 prochaines heures en courbe, les prévisions sur 10 jours et la qualité de l'air.

*English version: [README.en.md](README.en.md)*

## Pluie au quart d'heure et radar (nouveau en 1.3.0)

Une phrase pour la pluie des 2 prochaines heures (« pluie vers 14 h 30, dans 15 min ») avec une barre par quart d'heure, et le radar de pluie animé des 2 dernières heures autour de ta ville.

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

Les prévisions et la qualité de l'air viennent d'**Open-Meteo**, service libre et sans compte ; ce sont les seuls sites contactés. Le plugin ne garde rien : ta ville est un réglage de NeoDex (Paramètres, « Ville pour la météo »), sauvegardé et synchronisé entre tes PC avec tes autres réglages si la synchro est activée. Une autre ville cherchée ici sert le temps de la consultation.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Météo → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).

## La pluie au quart d’heure et le radar (1.3.0)

- **Pluie dans les 2 heures** : une phrase claire (« Pluie modérée vers 14 h 30 (dans 15 min), jusque vers 15 h 15 », « Il pleut : ça s’arrête vers 16 h ») et huit barres, une par quart d’heure. Les données viennent de la même demande qu’avant à Open-Meteo : aucune requête de plus.
- **Radar de pluie** : la carte autour de ta ville avec la pluie des 2 dernières heures, une image toutes les 10 min (RainViewer). **LECTURE** l’anime, le curseur choisit une image. Le point rose marque la ville.
- Le radar montre le passé ; pour la suite, regarde la pluie au quart d’heure juste au-dessus.
