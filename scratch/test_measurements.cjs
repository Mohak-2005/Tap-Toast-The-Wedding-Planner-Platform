const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('http://127.0.0.1:5173/#couple');
  await p.waitForTimeout(1000);
  const sTab = await p.$('button:has-text("Seating")');
  if (sTab) await sTab.click();
  await p.waitForTimeout(1000);

  const info = await p.evaluate(() => {
    const parent = document.getElementById('room_canvas_container');
    const inner = document.getElementById('room_canvas_inner_board');
    const dance = document.getElementById('canvas_main_dance_floor');
    const tables = Array.from(document.querySelectorAll('#room_canvas_inner_board > div')).map(el => ({
      text: el.innerText.replace(/\n/g, ' '),
      title: el.getAttribute('title'),
      styleLeft: el.style.left,
      styleTop: el.style.top,
      offsetTop: el.offsetTop,
      offsetLeft: el.offsetLeft,
    }));
    return {
      parentHeight: parent ? parent.offsetHeight : 0,
      innerHeight: inner ? inner.offsetHeight : 0,
      tables,
    };
  });
  console.log('MEASUREMENTS:', JSON.stringify(info, null, 2));
  await b.close();
})();
