const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Listen to console events
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // Listen to page errors
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    // Listen to response errors
    page.on('response', response => {
      if (!response.ok()) {
        console.log('RESPONSE ERROR:', response.url(), response.status());
      }
    });

    console.log('Navigating to http://localhost:5173/');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

    console.log('Done waiting.');
    await browser.close();
  } catch (e) {
    console.error('PUPPETEER ERROR:', e);
  }
})();
