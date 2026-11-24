# Météo (Weather)

The weather for your city or any other: the current conditions, the next 36 hours as a chart, the 10-day forecast and air quality.

*Version française : [README.md](README.md)*

## Rain by quarter hour and radar (new in 1.3.0)

A sentence for the rain of the next 2 hours (

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

## Rain by quarter hour and the radar (1.3.0)

- **Rain in the next 2 hours**: a clear sentence (“Moderate rain around 2:30 pm (in 15 min), until around 3:15 pm”, “It is raining: it stops around 4 pm”) and eight bars, one per quarter hour. The data comes from the same Open-Meteo request as before: no extra request.
- **Rain radar**: the map around your city with the rain of the last 2 hours, one image every 10 min (RainViewer). **PLAY** animates it, the slider picks an image. The pink dot marks the city.
- The radar shows the past; for what comes next, look at the rain by quarter hour just above.
