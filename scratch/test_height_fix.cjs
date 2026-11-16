const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('http://127.0.0.1:5173/#couple');
  await p.waitForTimeout(1000);
  const sTab = await p.$('button:has-text("Seating")');
  if (sTab) await sTab.click();
  await p.waitForTimeout(1000);

  const res = await p.evaluate(() => {
    const inner = document.getElementById('room_canvas_inner_board');
    if (inner) inner.style.height = '620px';
    const tables = Array.from(document.querySelectorAll('#room_canvas_inner_board > div')).map(el => ({
      text: el.innerText.replace(/\n/g, ' '),
      title: el.getAttribute('title'),
      styleTop: el.style.top,
      offsetTop: el.offsetTop,
    }));
    return { innerHeight: inner ? inner.offsetHeight : 0, tables };
  });
  console.log('RESULT WITH 620px HEIGHT:', JSON.stringify(res, null, 2));
  await b.close();
})();
