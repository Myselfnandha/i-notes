const puppeteer = require('puppeteer');

async function runAudit() {
  console.log('🚀 Starting Robust Visual Audit of i Notes PWA...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 420, height: 900, deviceScaleFactor: 2 });

    console.log('📱 Loading https://nandhaalagesan248-i-notes.static.hf.space ...');
    await page.goto('https://nandhaalagesan248-i-notes.static.hf.space', { waitUntil: 'networkidle0', timeout: 30000 });

    // Seed examples if needed
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const seed = btns.find(b => b.textContent && b.textContent.includes('Load Design Examples'));
      if (seed) seed.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    // 1. Notes Feed
    await page.screenshot({ path: 'audit_notes_feed.png' });
    console.log('📸 Captured audit_notes_feed.png');

    // 2. Click Checklists tab via evaluate
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('nav button'));
      const clBtn = btns.find(b => b.textContent && b.textContent.includes('Checklists'));
      if (clBtn) clBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: 'audit_checklists_view.png' });
    console.log('📸 Captured audit_checklists_view.png');

    // 3. Click into first checklist
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('h3'));
      const launchCard = cards.find(h => h.textContent && h.textContent.includes('Product Launch'));
      if (launchCard) {
        launchCard.closest('div[class*="cursor-pointer"]').click();
      }
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: 'audit_checklist_detail.png' });
    console.log('📸 Captured audit_checklist_detail.png');

    // Go back from checklist
    await page.evaluate(() => {
      const backBtn = document.querySelector('header button');
      if (backBtn) backBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // 4. Click Folders tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('nav button'));
      const fBtn = btns.find(b => b.textContent && b.textContent.includes('Folders'));
      if (fBtn) fBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: 'audit_folders_view.png' });
    console.log('📸 Captured audit_folders_view.png');

    // 5. Click Notes tab and open Note Editor
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('nav button'));
      const nBtn = btns.find(b => b.textContent && b.textContent.includes('Notes'));
      if (nBtn) nBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('h3'));
      const craftNote = cards.find(h => h.textContent && h.textContent.includes('Reflections on Craft'));
      if (craftNote) {
        craftNote.closest('div[class*="cursor-pointer"]').click();
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'audit_note_editor.png' });
    console.log('📸 Captured audit_note_editor.png');

    // 6. Desktop 1280x850 Layout
    await page.setViewport({ width: 1280, height: 850, deviceScaleFactor: 2 });
    await page.goto('https://nandhaalagesan248-i-notes.static.hf.space', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'audit_desktop_layout.png' });
    console.log('📸 Captured audit_desktop_layout.png');

    console.log('🎉 Full visual audit completed cleanly!');
  } finally {
    await browser.close();
  }
}

runAudit().catch(err => {
  console.error('Audit error:', err);
  process.exit(1);
});
