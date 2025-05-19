const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

async function main(destination = 'Casa de Campo Resort and Villas, La Romana, La Romana, Dominican Republic') {
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
        '--disable-site-isolation-trials'
      ]
    });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    const page = await wrap(await context.newPage());

    // Navigate to Google
    await page.goto('https://www.google.com');

    // Wait for the search textarea to be ready
    await page.waitForSelector('textarea[name="q"]');
    
    // Search for the hotel using the provided destination
    await page.fill('textarea[name="q"]', destination);
    await page.press('textarea[name="q"]', 'Enter');

    // Wait for search results
    await page.waitForTimeout(3000);

    // Click the "Check availability" button
    const checkAvailabilityButton = await page.getByText('Check availability');
    if (checkAvailabilityButton) {
      await checkAvailabilityButton.click();
    }

    // Wait for the new page to load
    await page.waitForTimeout(3000);

    // Define query for room listings
    const QUERY = `
    {
      room_listings[] {
        room_type
        price
        cancellation_policy
        total_price
      }
    }`;

    // Get room data
    const roomData = await page.queryData(QUERY);
    console.log('Room data:', JSON.stringify(roomData, null, 2));

    // Also get the raw HTML of room listings for verification
    const roomListings = await page.evaluate(() => {
      const listings = document.querySelectorAll('a.gw2Gcf');
      return Array.from(listings).map(listing => ({
        roomType: listing.querySelector('.rd5XM')?.textContent || '',
        cancellationPolicy: listing.querySelector('.WL9xgc')?.textContent?.trim() || '',
        price: listing.querySelector('.iqYCVb')?.textContent || '',
        originalPrice: listing.querySelector('.MW1oTb')?.textContent || '',
        totalPrice: listing.querySelector('.UeIHqb')?.textContent || ''
      }));
    });

    console.log('Room listings:', JSON.stringify(roomListings, null, 2));

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Get destination from command line argument or use default
const destination = process.argv[2] || 'Casa de Campo Resort and Villas, La Romana, La Romana, Dominican Republic';
main(destination); 