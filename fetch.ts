import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  const downloadPath = path.resolve('/app/applet/public/planetarium');
  
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });

  await page.goto('https://uploadnow.io/en/share?utm_source=v9p0ZMD', { waitUntil: 'networkidle0' });
  
  // Click the first file row
  const rows = await page.$$('div[role="row"]');
  if (rows.length > 1) {
    await rows[1].click();
    await new Promise(r => setTimeout(r, 1000));
    
    // Click the download selection button
    const downloadSelectionBtn = await page.$('button[title="Download selection"]');
    if (downloadSelectionBtn) {
      console.log("Clicking download selection...");
      await downloadSelectionBtn.click();
      
      // Wait for file to appear in directory
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const files = fs.readdirSync(downloadPath);
        if (files.some(f => f.includes('style.css'))) {
          console.log("File downloaded!");
          break;
        }
      }
    }
  }
  
  await browser.close();
})();
