# Météo (Weather)

The weather for your city or any other: the current conditions, the next 36 hours as a chart, the 10-day forecast and air quality.

*Version française : [README.md](README.md)*

## Now

At the top, the current weather: an icon (sunny, partly cloudy, overcast, fog, rain, snow, storm, by day or night), the temperature and the **feels-like** temperature, then the details:

- **wind** (speed, direction and gusts), **humidity**, **pressure**, **cloud cover**;
- **UV index**, **sun** (sunrise and sunset);
- **air quality** on the European index, from "Very good" to "Very poor", with its value;
- **rain** fallen or expected over 24 h.

## The next 36 hours

A chart shows the **temperature** as a line and the **chance of rain** as bars. Hover over it for each hour's details.

## 10 days

One row per day: the icon, the minimum and maximum temperatures on a shared bar (to compare days at a glance), the chance and amount of rain, and the wind. Hover over a day to see sunrise, sunset and maximum UV.

## Choosing the city

- **My city** shows the city set in NeoDex Settings.
- **Another city…**: type a name then **Enter** to see the weather elsewhere, without changing your city.

## Data and sync

Forecasts and air quality come from **Open-Meteo**, a free service with no account; these are the only sites contacted. The plugin keeps nothing: your city is a NeoDex setting (Settings, “City for the weather”), backed up and synced between your PCs with your other settings when sync is on. Another city searched here is only used while you look.

## Install

In NeoDex: **NeoStore → Discover → Météo → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
