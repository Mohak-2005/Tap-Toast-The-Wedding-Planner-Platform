async function check() {
  const url = 'https://mohak-2005.github.io/Tap-Toast-The-Wedding-Planner-Platform/index.html?v=' + Date.now();
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } });
  const text = await res.text();
  const match = text.match(/src="(\.\/assets\/[^"]+)"/);
  console.log('Live script reference:', match ? match[1] : 'not found');
  if (match && match[1].includes('BmVurPIE')) {
    console.log('✓ SUCCESS: Fresh bundle index-BmVurPIE.js is LIVE on GitHub Pages!');
  } else {
    console.log('Waiting for GitHub Pages deployment to finish...');
  }
}

check();
