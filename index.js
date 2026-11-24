// Météo : ton appli d'origine (HTML et code inchangés), livrée en plugin.
// Ses données sont dans le dossier du plugin, que NeoDex sauvegarde (synchro cloud et sauvegardes) ; à la première ouverture elle reprend ce que tu avais dans NeoDex.
// Elle tourne dans le bac à sable de NeoDex, avec ses outils d'interface (ctx.host) et seulement les autorisations de son plugin.json.
const HTML = "<div class=\"appWrap wide\">\n      <div class=\"agHead\"><span class=\"label\">Météo</span><input class=\"f\" id=\"mtCity\" placeholder=\"Autre ville… (Entrée)\" spellcheck=\"false\" style=\"width:clamp(200px,22vw,360px);margin-left:auto;font-size:16px;padding:9px 12px\"><button class=\"btn px\" id=\"mtHome\">MA VILLE</button></div>\n      <div class=\"sysCard px\" id=\"mtNow\"></div>\n      <div class=\"sysCard px mtSoon\"><span class=\"label\">Pluie dans les 2 heures</span><div id=\"mtSoonTxt\" class=\"mtSoonTxt\"></div><div id=\"mtSoonBars\" class=\"mtSoonBars\"></div></div>\n      <div class=\"sysCard px\"><div class=\"mtRadHead\"><span class=\"label\">Radar de pluie</span><button class=\"btn px\" id=\"mtPlay\">LECTURE</button><input type=\"range\" id=\"mtRadT\" min=\"0\" max=\"12\" value=\"12\"><span id=\"mtRadWhen\" class=\"mtRadWhen\"></span></div><div class=\"mtMap\" id=\"mtMap\"></div><div class=\"hint\">Les 2 dernières heures, une image toutes les 10 min (RainViewer) · le point rose : la ville · fond © Esri, HERE, Garmin, © OpenStreetMap</div></div>\n      <div class=\"sysCard px\"><span class=\"label\">Prochaines 36 heures</span><div id=\"mtHours\"></div><div class=\"chart small mtCh\"><canvas id=\"mtChart\"></canvas><div class=\"chTip\"></div></div><div class=\"hint\">Ligne : température · barres : risque de pluie · survole pour le détail</div></div>\n      <div class=\"sysCard px\"><span class=\"label\">10 jours</span><div id=\"mtDays\"></div></div>\n    </div>";
/*CSS-MOVED*/ const CSS = `#mtNow{flex-direction:row;flex-wrap:wrap;gap:30px;align-items:center}
.mtBig{display:flex;align-items:center;gap:24px}
.mtTemp{font:clamp(46px,3.8vw,76px) var(--title);color:#fff}
.mtDesc{font-size:clamp(18px,1.3vw,24px);color:var(--lilac);margin:8px 0 4px}
.mtGrid{flex:1;display:grid;grid-template-columns:repeat(auto-fill,minmax(clamp(170px,12vw,240px),1fr));gap:14px 20px}
.mtGrid div{display:flex;flex-direction:column;gap:6px}
.mtGrid b{font-weight:600;color:#fff;font-size:clamp(15px,1.05vw,19px)}
#mtHours{display:flex;gap:4px;overflow-x:auto;padding-bottom:6px}
.mtHour{flex:1 0 clamp(62px,4.4vw,86px);display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 0;background:rgba(255,255,255,.03)}
.mtHour b{color:#fff;font-size:clamp(16px,1.1vw,20px)}
.mtCh{height:clamp(140px,22vh,280px)!important}
.mtRain{font-size:clamp(12px,.85vw,15px);color:var(--muted)}
.mtRain.hi{color:#7fe0ee}
.mtDay{display:grid;grid-template-columns:clamp(110px,9vw,170px) 30px 44px 1fr 44px clamp(140px,11vw,210px) clamp(70px,6vw,110px);gap:12px;align-items:center;padding:clamp(8px,.7vw,12px) 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:clamp(15px,1.05vw,18px)}
@media (max-width:760px){.mtDay{grid-template-columns:96px 30px 40px 1fr 40px;font-size:14px}.mtDay>:nth-child(n+6){display:none}}
.mtDay .tn{color:#fff;text-transform:capitalize}
.mtDay .d{color:var(--lilac);text-align:right}
.mtRange{position:relative;height:8px;background:var(--field);box-shadow:inset 0 0 0 2px var(--line)}
.mtRange i{position:absolute;top:0;bottom:0;background:linear-gradient(90deg,#7fe0ee,var(--pink))}
.chTip{position:absolute;top:4px;pointer-events:none;display:none;padding:8px 10px;background:var(--win);box-shadow:0 0 0 2px var(--line2);font-size:13px;color:#fff;white-space:nowrap;line-height:1.5}
.chTip b{display:block;font:10px var(--title);color:var(--muted);letter-spacing:1px;margin-bottom:4px}
.chTip i{display:inline-block;width:8px;height:8px;margin-right:6px;background:var(--c)}
.mtSoonTxt{font-size:clamp(17px,1.25vw,22px);color:#fff;margin:6px 0 10px}
.mtSoonBars{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;align-items:end;height:70px}
.mtSoonBars div{display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px;height:100%;font-size:12px;color:var(--muted)}
.mtSoonBars i{display:block;width:100%;background:#4aa8ff;min-height:2px;opacity:.9}.mtSoonBars i.dry{background:var(--line2,#3a2a6e)}
.mtRadHead{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.mtRadHead .label{margin-right:auto}
#mtRadT{width:clamp(140px,18vw,280px);accent-color:var(--pink)}.mtRadWhen{min-width:150px;color:#fff;font-size:clamp(13px,.9vw,16px)}
.mtMap{position:relative;overflow:hidden;height:clamp(260px,42vh,520px);margin-top:10px;background:#0b0b14;box-shadow:inset 0 0 0 2px var(--line2,#3a2a6e)}
.mtMap .ly{position:absolute;left:0;top:0}.mtMap img{position:absolute;display:block;user-select:none;pointer-events:none}
.mtMap .rad img{opacity:.75}.mtMap .rad{display:none}.mtMap .rad.on{display:block}
.mtDot{position:absolute;width:14px;height:14px;margin:-9px 0 0 -9px;left:50%;top:50%;border:2px solid var(--pink,#ff4fd8);box-shadow:0 0 0 2px #000,inset 0 0 0 2px #000;z-index:3}
`;  // le style de ce plugin (il utilise les variables du thème de NeoDex)
// la pluie des 2 prochaines heures en une phrase, d'après les quarts d'heure d'Open-Meteo (t : heures locales « 2026-11-24T14:30 », mm : pluie de chaque quart d'heure)
const mtHM = t => t.slice(11, 13).replace(/^0/, '') + ' h ' + t.slice(14, 16);
const mtSoonDur = m => m <= 0 ? 'maintenant' : 'dans ' + (m < 60 ? m + ' min' : Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + String(m % 60).padStart(2, '0') : ''));
const mtHow = mm => mm < 0.25 ? 'faible' : mm < 1 ? 'modérée' : 'forte';
function mtSoon(t, mm, nowIso) {
  const wet = v => v >= 0.1, now = new Date(nowIso), at = i => Math.max(0, Math.round((new Date(t[i]) - now) / 60000 / 5) * 5);
  const n = Math.min(t.length, 8); if (!n) return '';
  if (wet(mm[0])) {
    const stop = mm.slice(0, n).findIndex(v => !wet(v)), peak = Math.max(...mm.slice(0, stop < 0 ? n : stop));
    return stop < 0 ? 'Il pleut (' + mtHow(peak) + '), et ça continue pendant les 2 prochaines heures.' : 'Il pleut (' + mtHow(peak) + ') : ça s’arrête vers ' + mtHM(t[stop]) + ' (' + mtSoonDur(at(stop)) + ').';
  }
  const start = mm.slice(0, n).findIndex(wet); if (start < 0) return 'Pas de pluie dans les 2 prochaines heures.';
  let end = mm.slice(start, n).findIndex(v => !wet(v)); end = end < 0 ? n : start + end;
  return 'Pluie ' + mtHow(Math.max(...mm.slice(start, end))) + ' vers ' + mtHM(t[start]) + ' (' + mtSoonDur(at(start)) + ')' + (end < n ? ', jusque vers ' + mtHM(t[end]) : '') + '.';
}
// la tuile (x, y) de zoom z qui contient un lieu, avec sa partie décimale
const mtTile = (lat, lon, z) => { const n = 2 ** z, r = lat * Math.PI / 180; return [(lon + 180) / 360 * n, (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n]; };
{ const T = ['2026-11-24T14:15', '2026-11-24T14:30', '2026-11-24T14:45', '2026-11-24T15:00', '2026-11-24T15:15', '2026-11-24T15:30', '2026-11-24T15:45', '2026-11-24T16:00'], N = '2026-11-24T14:20';
  const a = mtSoon(T, [0, 0, 0.4, 0.6, 0, 0, 0, 0], N), b = mtSoon(T, [0.3, 0.2, 0, 0, 0, 0, 0, 0], N), c = mtSoon(T, [0, 0, 0, 0, 0, 0, 0, 0], N), d = mtSoon(T, [1.2, 1, 1, 1, 1, 1, 1, 1], N), [x, y] = mtTile(48.8566, 2.3522, 7);
  console.assert(a === 'Pluie modérée vers 14 h 45 (dans 25 min), jusque vers 15 h 15.' && b === 'Il pleut (modérée) : ça s’arrête vers 14 h 45 (dans 25 min).' && c === 'Pas de pluie dans les 2 prochaines heures.'
    && d === 'Il pleut (forte), et ça continue pendant les 2 prochaines heures.' && Math.floor(x) === 64 && Math.floor(y) === 44, 'météo : pluie et tuiles', a, b, c, d, x, y); }

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx, ask, newTab, pixIcon, PIX, WX } = host;
  const folder = ctx.folder, legacy = ctx.legacy || {};
  ctx.host.addStyle(CSS);
  view.innerHTML = HTML;
  const $ = id => id === "meteoApp" ? view : (view.querySelector('#' + id) || document.getElementById(id));  // les identifiants de ta vue d'abord, puis ceux de la page (fenêtres, menus)
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const __icon = () => ctx.icon;  // l'icône de ce plugin
  const prefs = new Proxy({}, { get: (_, k) => host.pref(k) });  // les réglages de NeoDex, en lecture seule
  // ---- ton code d'origine ----
const WX_LABEL = {sun: 'Ensoleillé', moon: 'Dégagé', partly: 'Éclaircies', cloud: 'Couvert', fog: 'Brouillard', rain: 'Pluie', snow: 'Neige', storm: 'Orage'};
const wxKind = (c, day) => c === 0 ? (day ? 'sun' : 'moon') : c <= 2 ? 'partly' : c === 3 ? 'cloud' : c <= 48 ? 'fog'
  : c <= 67 || (c >= 80 && c <= 82) ? 'rain' : c <= 77 || c === 85 || c === 86 ? 'snow' : 'storm';  // WMO weather codes

/* ---------- Météo app: Open-Meteo forecast (10 days, hour by hour) and air quality, for the city of the settings or another one ---------- */
let mt = null;  // {name, lat, lon}
const MT_DIR = d => ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'][Math.round(d / 45) % 8];
const MT_AQI = v => v == null ? ['—', ''] : v <= 20 ? ['Très bon', 'good'] : v <= 40 ? ['Bon', 'good'] : v <= 60 ? ['Moyen', ''] : v <= 80 ? ['Médiocre', 'soon'] : v <= 100 ? ['Mauvais', 'urgent'] : ['Très mauvais', 'late'];
const mtIcon = (code, day, scale = 3) => { const k = wxKind(code, day); const s = el('span', 'mtIc'); s.innerHTML = pixIcon(WX[k][1], scale); s.style.color = WX[k][0]; s.title = WX_LABEL[k]; return s; };
async function mtOpen() {
  mt ??= prefs.weatherCity ? {name: prefs.weatherCity, lat: prefs.weatherLat, lon: prefs.weatherLon} : null;
  if (!mt) { $('mtNow').replaceChildren(el('div', 'hint', 'Cherche une ville ci-dessus (ou choisis-la dans Paramètres).')); return; }
  $('mtCity').value = '';
  try {
    const q = `latitude=${mt.lat}&longitude=${mt.lon}&timezone=auto`;
    const [f, aq] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?${q}&forecast_days=10&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,precipitation,cloud_cover,uv_index` +
        '&minutely_15=precipitation&forecast_minutely_15=8&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,is_day,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max').then(r => r.json()),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${q}&current=european_aqi,pm2_5,pm10,ozone`).then(r => r.json()).catch(() => null)]);
    mtRender(f, aq);
  } catch (e) { $('mtNow').replaceChildren(el('div', 'hint', 'Météo indisponible : ' + e.message)); }
}
function mtRender(f, aq) {
  const c = f.current, d = f.daily, hh = (t => t.slice(11, 16));
  const big = el('div', 'mtBig'), info = el('div', 'mtGrid'), stat = (k, v) => { const s = el('div'); s.append(el('span', 'label', k), el('b', '', v)); info.append(s); };
  const k = wxKind(c.weather_code, c.is_day);
  big.append(mtIcon(c.weather_code, c.is_day, 7), (() => { const t = el('div'); t.append(el('div', 'mtTemp', Math.round(c.temperature_2m) + '°'), el('div', 'mtDesc', WX_LABEL[k] + ' · ressenti ' + Math.round(c.apparent_temperature) + '°'), el('div', 'hint', mt.name + ' · ' + Math.round(d.temperature_2m_min[0]) + '° / ' + Math.round(d.temperature_2m_max[0]) + '°')); return t; })());
  stat('Vent', Math.round(c.wind_speed_10m) + ' km/h ' + MT_DIR(c.wind_direction_10m) + ' · rafales ' + Math.round(c.wind_gusts_10m));
  stat('Humidité', c.relative_humidity_2m + ' %'); stat('Pression', Math.round(c.pressure_msl) + ' hPa'); stat('Nuages', c.cloud_cover + ' %');
  stat('Indice UV', String(Math.round(c.uv_index ?? d.uv_index_max[0]))); stat('Soleil', '↑ ' + hh(d.sunrise[0]) + ' · ↓ ' + hh(d.sunset[0]));
  const [aqLabel] = MT_AQI(aq?.current?.european_aqi);
  stat("Qualité de l'air", aqLabel + (aq?.current ? ' (' + Math.round(aq.current.european_aqi) + ')' : ''));
  stat('Pluie (24 h)', (f.hourly.precipitation.slice(0, 24).reduce((a, b) => a + b, 0)).toFixed(1).replace('.', ',') + ' mm');
  $('mtNow').replaceChildren(big, info);
  // la pluie des 2 prochaines heures
  const m15 = f.minutely_15;
  if (m15?.time?.length) {
    $('mtSoonTxt').textContent = mtSoon(m15.time, m15.precipitation, c.time);
    const top = Math.max(1, ...m15.precipitation.slice(0, 8));
    $('mtSoonBars').replaceChildren(...m15.time.slice(0, 8).map((t, i) => { const v = m15.precipitation[i] || 0, b = el('div'), bar = el('i', v >= 0.1 ? '' : 'dry');
      bar.style.height = Math.max(3, v / top * 46) + 'px'; b.title = mtHM(t) + ' : ' + v.toFixed(1).replace('.', ',') + ' mm'; b.append(bar, el('span', '', mtHM(t).replace(' h ', ':'))); return b; }));
    $('mtSoonTxt').closest('.sysCard').hidden = false;
  } else $('mtSoonTxt').closest('.sysCard').hidden = true;
  radarOpen();
  // next 36 hours from now
  const now = f.hourly.time.findIndex(t => t >= c.time.slice(0, 13)), hours = f.hourly.time.slice(now, now + 36).map((t, i) => ({t, temp: f.hourly.temperature_2m[now + i], p: f.hourly.precipitation_probability[now + i], mm: f.hourly.precipitation[now + i], code: f.hourly.weather_code[now + i], day: f.hourly.is_day[now + i], wind: f.hourly.wind_speed_10m[now + i]}));
  $('mtHours').replaceChildren(...hours.map((h, i) => { const b = el('div', 'mtHour'); b.append(el('span', 'label', i ? hh(h.t).slice(0, 2) + ' h' : 'MAINT.'), mtIcon(h.code, h.day, 2), el('b', '', Math.round(h.temp) + '°'), el('span', 'mtRain' + (h.p >= 50 ? ' hi' : ''), h.p + ' %')); b.title = `${hh(h.t)} : ${Math.round(h.temp)}°, pluie ${h.p} % (${h.mm} mm), vent ${Math.round(h.wind)} km/h`; return b; }));
  mtChart($('mtChart'), hours);
  // 10 days, with each day's range drawn on the week's scale
  const lo = Math.min(...d.temperature_2m_min), hi = Math.max(...d.temperature_2m_max);
  $('mtDays').replaceChildren(...d.time.map((t, i) => {
    const r = el('div', 'mtDay'), bar = el('div', 'mtRange'), fill = el('i');
    fill.style.left = (d.temperature_2m_min[i] - lo) / (hi - lo || 1) * 100 + '%'; fill.style.right = (hi - d.temperature_2m_max[i]) / (hi - lo || 1) * 100 + '%'; bar.append(fill);
    r.append(el('span', 'tn', i ? new Date(t + 'T12:00').toLocaleDateString('fr-FR', {weekday: 'short', day: 'numeric'}) : "Aujourd'hui"), mtIcon(d.weather_code[i], 1, 2),
      el('span', 'd', Math.round(d.temperature_2m_min[i]) + '°'), bar, el('span', 'd', Math.round(d.temperature_2m_max[i]) + '°'),
      el('span', 'mtRain' + (d.precipitation_probability_max[i] >= 50 ? ' hi' : ''), d.precipitation_probability_max[i] + ' % · ' + d.precipitation_sum[i].toFixed(1).replace('.', ',') + ' mm'), el('span', 'd', Math.round(d.wind_speed_10m_max[i]) + ' km/h'));
    r.title = `Lever ${hh(d.sunrise[i])}, coucher ${hh(d.sunset[i])}, UV max ${Math.round(d.uv_index_max[i])}`;
    return r;
  }));
}
// temperature line (pixel steps) with rain chance as bars, hover shows the hour
function mtChart(cv, hours) {
  cv._h = hours;
  const dpr = devicePixelRatio, w = cv.clientWidth, h = cv.clientHeight, tip = cv.nextElementSibling; if (!w) return;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  const g = cv.getContext('2d'), css = getComputedStyle(document.documentElement), col = v => css.getPropertyValue(v).trim();
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const ts = hours.map(x => x.temp), lo = Math.floor(Math.min(...ts)) - 1, hi = Math.ceil(Math.max(...ts)) + 1, step = w / hours.length, Y = v => Math.round(h - 18 - (v - lo) / (hi - lo) * (h - 36));
  g.font = '12px ' + css.getPropertyValue('--text');
  hours.forEach((x, i) => { g.fillStyle = col('--violet'); g.globalAlpha = .35; const bh = x.p / 100 * (h - 36); g.fillRect(Math.round(i * step + 2), h - 18 - bh, Math.max(1, Math.round(step - 4)), bh); g.globalAlpha = 1; });
  g.fillStyle = col('--pink');
  hours.forEach((x, i) => { const x0 = Math.round(i * step), y0 = Y(x.temp); g.fillRect(x0, y0 - 1, Math.ceil(step), 2); if (i) { const yp = Y(hours[i - 1].temp); g.fillRect(x0, Math.min(yp, y0) - 1, 2, Math.abs(y0 - yp) + 2); } });
  g.fillStyle = col('--muted');
  hours.forEach((x, i) => { if (i % 6 === 0) g.fillText(x.t.slice(11, 13) + ' h', Math.round(i * step + 2), h - 3); });
  const i = cv._hx == null ? -1 : Math.min(hours.length - 1, Math.floor(cv._hx / step));
  if (i < 0) { tip.style.display = 'none'; return; }
  const x = hours[i], hx = Math.round(i * step + step / 2);
  g.fillStyle = col('--muted'); g.fillRect(hx, 0, 1, h - 18);
  g.fillStyle = col('--win'); g.fillRect(hx - 5, Y(x.temp) - 5, 10, 10); g.fillStyle = col('--pink'); g.fillRect(hx - 4, Y(x.temp) - 4, 8, 8);
  tip.replaceChildren(el('b', '', new Date(x.t).toLocaleString('fr-FR', {weekday: 'short', hour: '2-digit', minute: '2-digit'}).toUpperCase()), el('div', '', Math.round(x.temp * 10) / 10 + ' °C'), el('div', '', 'Pluie : ' + x.p + ' % · ' + x.mm + ' mm'), el('div', '', 'Vent : ' + Math.round(x.wind) + ' km/h'));
  tip.style.display = 'block'; tip.style.left = (hx + 14 + tip.offsetWidth > w ? hx - 14 - tip.offsetWidth : hx + 14) + 'px';
}
new ResizeObserver(() => $('mtChart')._h && mtChart($('mtChart'), $('mtChart')._h)).observe($('mtChart'));
$('mtChart').onmousemove = e => { $('mtChart')._hx = e.offsetX; $('mtChart')._h && mtChart($('mtChart'), $('mtChart')._h); };
$('mtChart').onmouseleave = () => { $('mtChart')._hx = null; $('mtChart')._h && mtChart($('mtChart'), $('mtChart')._h); };
$('mtCity').onkeydown = async e => {
  if (e.key !== 'Enter' || !e.target.value.trim()) return;
  try {
    const r = (await fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&language=fr&name=' + encodeURIComponent(e.target.value.trim())).then(r => r.json())).results?.[0];
    if (!r) return toast('Ville introuvable', true);
    mt = {name: r.name + (r.admin1 ? ', ' + r.admin1 : ''), lat: r.latitude, lon: r.longitude}; mtOpen();
  } catch (err) { toast('Recherche impossible : ' + err.message, true); }
};
$('mtHome').onclick = () => { mt = null; mtOpen(); };
// ---- le radar : 5 × 3 tuiles de zoom 7 autour de la ville (fond Esri, pluie RainViewer, noms des villes par-dessus) ----
const RZ = 7, RT = 256;
let rad = null, radI = 12, radPlay = null;
async function radarOpen(json) {
  if (!mt?.lat) return;
  try { json ??= await fetch('https://api.rainviewer.com/public/weather-maps.json').then(r => r.json()); } catch { $('mtRadWhen').textContent = 'radar indisponible'; return; }
  const frames = (json.radar?.past || []).slice(-13); if (!frames.length) return;
  const [x, y] = mtTile(mt.lat, mt.lon, RZ), cx = Math.floor(x), cy = Math.floor(y), cells = [];
  for (let dy = -1; dy <= 1; dy++) for (let dx = -2; dx <= 2; dx++) cells.push([cx + dx, cy + dy, dx + 2, dy + 1]);
  const layer = (url, cls) => { const d = el('div', 'ly ' + cls); for (const [tx, ty, gx, gy] of cells) { const i = el('img'); i.alt = ''; i.dataset.g = gx + ',' + gy; i.dataset.src = url(tx, ty); d.append(i); } return d; };
  const base = layer((tx, ty) => 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/' + RZ + '/' + ty + '/' + tx, 'base');
  const lab = layer((tx, ty) => 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/' + RZ + '/' + ty + '/' + tx, 'lab');
  const rads = frames.map(fr => layer((tx, ty) => json.host + fr.path + '/' + RT + '/' + RZ + '/' + tx + '/' + ty + '/2/1_1.png', 'rad'));
  rad = { x, y, cx, cy, frames, base, lab, rads };
  const dot = el('div', 'mtDot'); dot.title = mt.name;
  $('mtMap').replaceChildren(base, ...rads, lab, dot);
  $('mtRadT').max = frames.length - 1; radI = frames.length - 1; $('mtRadT').value = radI;
  radarPlace(); radarShow(radI);
}
function radarPlace() {  // la ville au centre ; une tuile fait la place pour que 3,2 tuiles tiennent dans la largeur (à peine agrandies : texte net)
  if (!rad) return; const m = $('mtMap'), W = m.clientWidth, H = m.clientHeight; if (!W) return;
  const T = Math.max(200, W / 3.2), ox = W / 2 - (rad.x - (rad.cx - 2)) * T, oy = H / 2 - (rad.y - (rad.cy - 1)) * T;
  for (const img of m.querySelectorAll('img')) { const [gx, gy] = img.dataset.g.split(',').map(Number); Object.assign(img.style, { left: ox + gx * T + 'px', top: oy + gy * T + 'px', width: T + 'px', height: T + 'px' }); }
  for (const ly of [rad.base, rad.lab]) for (const img of ly.children) if (!img.src) img.src = img.dataset.src;
}
function radarShow(i) {
  if (!rad) return; radI = i;
  rad.rads.forEach((ly, k) => { ly.classList.toggle('on', k === i); if (k === i) for (const img of ly.children) if (!img.src) img.src = img.dataset.src; });
  const t = rad.frames[i].time * 1000, ago = Math.round((Date.now() - t) / 60000);
  $('mtRadWhen').textContent = new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + (i === rad.frames.length - 1 ? ' · dernière image' : ' · il y a ' + ago + ' min');
  $('mtRadT').value = i;
}
const radStop = () => { clearInterval(radPlay); radPlay = null; $('mtPlay').textContent = 'LECTURE'; };
$('mtPlay').onclick = () => {
  if (radPlay) return radStop();
  if (!rad) return; for (const ly of rad.rads) for (const img of ly.children) if (!img.src) img.src = img.dataset.src;  // toutes les images, une fois
  $('mtPlay').textContent = 'PAUSE'; let wait = 0;
  radPlay = setInterval(() => { if (wait) return wait--; const n = (radI + 1) % rad.frames.length; radarShow(n); if (n === rad.frames.length - 1) wait = 3; }, 450);
};
$('mtRadT').oninput = e => { radStop(); radarShow(+e.target.value); };
new ResizeObserver(radarPlace).observe($('mtMap'));  // (non indenté : les textes sur plusieurs lignes restent exactement les tiens)
  // ---- fin ----
  view.__mt = {render: (f, aq, name, lat, lon, radar) => { mt = {name, lat, lon}; mtRender(f, aq); if (radar) radarOpen(radar); }};  // pour l'auto-test
  ctx.onOpen(() => { mtOpen(); });
  ctx.onClose?.(() => { clearInterval(radPlay); radPlay = null; });
}
