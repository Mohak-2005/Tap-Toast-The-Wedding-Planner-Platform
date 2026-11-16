const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('http://127.0.0.1:5173/#couple');
  await p.waitForTimeout(1000);

  const tablesState = await p.evaluate(() => {
    const raw = localStorage.getItem('wedding_app_state_v1');
    if (!raw) return { error: 'no local storage' };
    const parsed = JSON.parse(raw);
    return {
      tables: (parsed.tables || []).filter(t => t.weddingId === 'w1').map(t => ({ id: t.id, name: t.name, x: t.x, y: t.y })),
      weddingDanceFloor: parsed.weddings?.[0]?.danceFloorPos,
    };
  });
  console.log('SAVED TABLES STATE:', JSON.stringify(tablesState, null, 2));
  await b.close();
})();
