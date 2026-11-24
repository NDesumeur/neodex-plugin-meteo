// lancé par le test « local » de NeoDex, une prévision intégrée (avec la pluie au quart d’heure) et le vrai radar s’il répond, la grande température, 36 heures et 10 jours ; le graphique prend toute la largeur ; rien ne déborde
module.exports = async ({ pj, sleep, shot }) => {
  await sleep(1000);
  let radar = null; try { radar = await (await fetch('https://api.rainviewer.com/public/weather-maps.json')).json(); } catch {}
  await pj(`window.__radar = ${JSON.stringify(radar)}, 0`);
  const r = await pj(`(() => {
    const v = document.querySelector('.appWrap').parentElement, t0 = new Date('2026-11-16T00:00'), iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    const H = Array.from({length: 240}, (_, i) => new Date(t0.getTime() + i * 36e5)), D = Array.from({length: 10}, (_, i) => iso(new Date(t0.getTime() + i * 864e5)).slice(0, 10));
    const f = { current: { time: iso(H[10]), temperature_2m: 11.4, apparent_temperature: 9.8, relative_humidity_2m: 82, weather_code: 3, is_day: 1, wind_speed_10m: 18, wind_direction_10m: 250, wind_gusts_10m: 41, pressure_msl: 1012, precipitation: 0, cloud_cover: 90, uv_index: 1 },
      hourly: { time: H.map(iso), temperature_2m: H.map((_, i) => 8 + 5 * Math.sin(i / 24 * 2 * Math.PI)), precipitation_probability: H.map((_, i) => (i * 13) % 100), precipitation: H.map(() => 0.2), weather_code: H.map((_, i) => [0, 2, 3, 61][i % 4]), is_day: H.map((d) => +(d.getHours() > 7 && d.getHours() < 18)), wind_speed_10m: H.map(() => 15) },
      daily: { time: D, weather_code: D.map((_, i) => [0, 3, 61, 71, 95][i % 5]), temperature_2m_max: D.map((_, i) => 12 + i % 4), temperature_2m_min: D.map((_, i) => 3 + i % 3), sunrise: D.map(d => d + 'T07:48'), sunset: D.map(d => d + 'T17:09'), precipitation_sum: D.map((_, i) => i * .7), precipitation_probability_max: D.map((_, i) => i * 10), wind_speed_10m_max: D.map(() => 30), uv_index_max: D.map(() => 1) } };
    f.minutely_15 = { time: [0, 1, 2, 3, 4, 5, 6, 7].map(i => iso(new Date(H[10].getTime() + i * 9e5))), precipitation: [0, 0, 0.5, 0.8, 0.2, 0, 0, 0] };
    v.__mt.render(f, { current: { european_aqi: 24 } }, 'Rennes, Bretagne', 48.11, -1.68, window.__radar);
    return 1; })()`);
  await sleep(400);
  const m = await pj(`(() => {
    const cv = document.getElementById('mtChart'), card = cv.closest('.sysCard');
    return { hours: document.querySelectorAll('.mtHour').length, days: document.querySelectorAll('.mtDay').length, temp: parseFloat(getComputedStyle(document.querySelector('.mtTemp')).fontSize),
      chart: Math.round(cv.getBoundingClientRect().width), card: Math.round(card.getBoundingClientRect().width), pxw: cv.width,
      over: [...document.querySelectorAll('.appWrap *')].filter(e => !e.closest('#mtHours') && !e.closest('#mtMap') && e.getBoundingClientRect().right > innerWidth + 1).length }; })()`);
  if (m.hours !== 36 || m.days !== 10) throw new Error('prévision : ' + JSON.stringify(m));
  if (m.chart < m.card * .85 || !m.pxw) throw new Error('graphique trop étroit : ' + JSON.stringify(m));
  if (m.over) throw new Error(m.over + ' élément(s) débordent à droite');
  const soon = await pj(`document.getElementById('mtSoonTxt').textContent`);
  if (soon !== 'Pluie modérée vers 10 h 30 (dans 30 min), jusque vers 11 h 15.' || await pj(`document.querySelectorAll('#mtSoonBars i:not(.dry)').length`) !== 3) throw new Error('pluie dans les 2 heures : ' + soon);
  let radTxt = 'radar injoignable';
  if (radar) {
    await sleep(2500);
    const rd = await pj(`(() => { const m = document.getElementById('mtMap'), b = [...m.querySelectorAll('.base img')], r = [...m.querySelectorAll('.rad.on img')];
      return { base: b.filter(i => i.naturalWidth).length, rad: r.filter(i => i.naturalWidth).length, frames: m.querySelectorAll('.rad').length, when: document.getElementById('mtRadWhen').textContent }; })()`);
    if (rd.base !== 15 || rd.rad !== 15 || rd.frames < 10) throw new Error('radar : ' + JSON.stringify(rd));
    await pj(`document.getElementById('mtPlay').click(), 0`); await sleep(1500); const w2 = await pj(`document.getElementById('mtRadWhen').textContent`); await pj(`document.getElementById('mtPlay').click(), 0`);
    if (w2 === rd.when) throw new Error('lecture du radar : l’image ne change pas');
    radTxt = 'radar : 15 tuiles de fond et 15 de pluie chargées, ' + rd.frames + ' images, la lecture avance';
  }
  if (shot) { await pj(`document.getElementById('mtMap').scrollIntoView(), 0`); await sleep(300); await shot('radar'); }
  return soon + ' · ' + radTxt + ' · 36 heures et 10 jours, température en ' + m.temp + ' px, graphique de ' + m.chart + ' px sur ' + m.card;
};
