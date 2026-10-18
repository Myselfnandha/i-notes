const puppeteer = require('puppeteer');

async function testDesktop() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 850, deviceScaleFactor: 2 });
    await page.goto('https://nandhaalagesan248-i-notes.static.hf.space', { waitUntil: 'networkidle0' });

    // Seed if empty
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const seed = btns.find(b => b.textContent && b.textContent.includes('Load Design Examples'));
      if (seed) seed.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({ path: 'audit_desktop_layout.png' });
    console.log('📸 Desktop layout captured successfully!');
  } finally {
    await browser.close();
  }
}

testDesktop().catch(err => {
  console.error(err);
  process.exit(1);
});
