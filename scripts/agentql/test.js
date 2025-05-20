const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

async function main(destination, checkInDate, checkOutDate) {
  try {
    // Configure AgentQL
    configure({
      apiKey: process.env.AGENTQL_API_KEY || 'LvB1kXDgNqditROfZ5MzavRZB0JC1BWNyUp6zwGojwUTFI2_bhGPPA',
    });

    // Launch browser with custom user agent and additional options
    const browser = await chromium.launch({
      headless: false,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-site-isolation-trials',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false
    });

    // Add additional headers to appear more like a regular browser
    await context.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    });

    const page = await wrap(await context.newPage());

    // Navigate to Google
    await page.goto('https://www.google.com', { waitUntil: 'networkidle' });

    // Wait for the search textarea to be ready
    await page.waitForSelector('textarea[name="q"]');
    
    // Search for the hotel using the provided destination
    await page.fill('textarea[name="q"]', destination);
    await page.press('textarea[name="q"]', 'Enter');

    // Wait for search results and handle any potential sign-in prompts
    await page.waitForTimeout(3000);

    // Click the "Check availability" button
    const checkAvailabilityButton = await page.getByText('Check availability');
    if (checkAvailabilityButton) {
      await checkAvailabilityButton.click();
    }

    // Wait for the new page to load
    await page.waitForTimeout(3000);

    // Update check-in date using the exact selector
    const checkInInput = await page.waitForSelector('#prices > c-wiz.K1smNd > c-wiz.tuyxUe > div > section > div.LEPXne > div.w1RZXe.sgtnuf.abhqy.nIkIJf.WzEC0e.FwR7Pc.K6nYpf > div > div.Ryi7tc.pI31md.hh3Grb > div:nth-child(2) > div > input');
    if (checkInInput) {
      await checkInInput.click();
      await checkInInput.fill(''); // Clear the input first
      await checkInInput.fill(checkInDate);
      await checkInInput.press('Enter');
    }

    // Click the Done button after check-in date
    const doneButton = await page.waitForSelector('button.VfPpkd-LgbsSe-OWXEXe-k8QpJ[jsname="iib5kc"]');
    if (doneButton) {
      await doneButton.click();
    }

    // Wait a bit for the date picker to close
    await page.waitForTimeout(1000);

    // Update check-out date using the exact selector
    const checkOutInput = await page.waitForSelector('#ow12 > div > div.Ryi7tc.pI31md.hh3Grb > div:nth-child(4) > div > input');
    if (checkOutInput) {
      await checkOutInput.click();
      await checkOutInput.fill(''); // Clear the input first
      await checkOutInput.fill(checkOutDate);
      await checkOutInput.press('Enter');
    }

    // Click the Done button after check-out date
    const doneButton2 = await page.waitForSelector('button.VfPpkd-LgbsSe-OWXEXe-k8QpJ[jsname="iib5kc"]');
    if (doneButton2) {
      await doneButton2.click();
    }

    // Wait for results to load
    await page.waitForTimeout(3000);

    // Get room listings with booking URLs
    const roomListings = await page.evaluate(() => {
      const listings = document.querySelectorAll('div.zIL9xf.xIAdxb');
      return Array.from(listings).map(listing => {
        const visitButton = listing.querySelector('button[jsname="Nu1Wwd"]');
        const bookingUrl = visitButton?.closest('a')?.href || '';
        
        return {
          provider: listing.querySelector('.FjC1We')?.textContent || '',
          price: listing.querySelector('.nDkDDb')?.textContent || '',
          totalPrice: listing.querySelector('.UeIHqb')?.textContent || '',
          cancellationPolicy: listing.querySelector('.niTXmc')?.textContent || '',
          bookingUrl: bookingUrl
        };
      });
    });

    await browser.close();
    return roomListings;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Export the main function
module.exports = main; 