const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000/about...');
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle0', timeout: 30000 });

  // 1. Capture Hero & Upper Fold
  const heroShot = path.join('C:\\Users\\Mouroof\\.gemini\\antigravity\\brain\\c65fa473-f753-4148-9292-70ebbc2e0905', 'live_nextjs_about_hero.png');
  await page.screenshot({ path: heroShot, fullPage: false });
  console.log('Hero screenshot captured:', heroShot);

  // 2. Capture Entire Page Full Scroll
  const fullShot = path.join('C:\\Users\\Mouroof\\.gemini\\antigravity\\brain\\c65fa473-f753-4148-9292-70ebbc2e0905', 'live_nextjs_about_full.png');
  await page.screenshot({ path: fullShot, fullPage: true });
  console.log('Full page screenshot captured:', fullShot);

  await browser.close();
})();
