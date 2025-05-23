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

    // Try to find and click the "Check availability" button with more specific selectors
    try {
      // Wait for the Google Hotels card to be visible
      await page.waitForSelector('div[data-ved*="2ahUKEw"]', { timeout: 5000 });
      
      // Find the specific "Check availability" button within the Google Hotels card
      const checkAvailabilityButton = await page.waitForSelector('div[data-ved*="2ahUKEw"] a[data-target-url*="/travel/search"]', { timeout: 5000 });
      
      if (checkAvailabilityButton) {
        await checkAvailabilityButton.click();
      } else {
        // Fallback to the generic button if the specific one isn't found
        const genericButton = await page.waitForSelector('a[data-target-url*="/travel/search"]', { timeout: 5000 });
        if (genericButton) {
          await genericButton.click();
        }
      }
    } catch (error) {
      // Continue with search if button not found
    }

    // Wait for the new page to load
    await page.waitForTimeout(3000);

    // Update check-in date using the exact selector
    try {
      const checkInInput = await page.waitForSelector('input[placeholder*="Check-in"], input[placeholder*="Check in"]', { timeout: 5000 });
      if (checkInInput) {
        await checkInInput.click();
        await checkInInput.fill(''); // Clear the input first
        await checkInInput.fill(checkInDate);
        await checkInInput.press('Enter');
      }
    } catch (error) {
      // Continue if check-in input not found
    }

    // Click the Done button after check-in date
    try {
      const doneButton = await page.waitForSelector('button:has-text("Done"), button[aria-label="Done"]', { timeout: 5000 });
      if (doneButton) {
        await doneButton.click();
      }
    } catch (error) {
      // Continue if done button not found
    }

    // Wait a bit for the date picker to close
    await page.waitForTimeout(1000);

    // Update check-out date using the exact selector
    try {
      const checkOutInput = await page.waitForSelector('input[placeholder*="Check-out"], input[placeholder*="Check out"]', { timeout: 5000 });
      if (checkOutInput) {
        await checkOutInput.click();
        await checkOutInput.fill(''); // Clear the input first
        await checkOutInput.fill(checkOutDate);
        await checkOutInput.press('Enter');
      }
    } catch (error) {
      // Continue if check-out input not found
    }

    // Click the Done button after check-out date
    try {
      const doneButton2 = await page.waitForSelector('button:has-text("Done"), button[aria-label="Done"]', { timeout: 5000 });
      if (doneButton2) {
        await doneButton2.click();
      }
    } catch (error) {
      // Continue if done button not found
    }

    // Wait for results to load
    await page.waitForTimeout(3000);

    // Get room listings with booking URLs
    const roomListings = await page.evaluate(() => {
      const listings = [];
      
      // Find all provider sections (Hotels.com, Booking.com, etc.)
      const providerSections = document.querySelectorAll('div[class*="CcERhd"]');
      
      providerSections.forEach(section => {
        // Get provider name
        const providerName = section.querySelector('[class*="FjC1We"]')?.textContent?.trim() || '';
        
        // Get all room listings within this provider section
        const roomElements = section.querySelectorAll('a[class*="gkynWe"]');
        
        roomElements.forEach(room => {
          const roomType = room.querySelector('[class*="EI1JTd"]')?.textContent?.trim() || '';
          const features = Array.from(room.querySelectorAll('[class*="niTXmc"] span'))
            .map(feature => feature.textContent?.trim())
            .filter(Boolean);
          
          const priceElement = room.querySelector('[class*="nDkDDb"]');
          const totalPriceElement = room.querySelector('[class*="MW1oTb"]');
          
          const bookingUrl = room.href || '';
          
          if (roomType && (priceElement || totalPriceElement)) {
            listings.push({
              provider: providerName,
              roomType: roomType,
              features: features,
              basePrice: priceElement?.textContent?.trim() || '',
              totalPrice: totalPriceElement?.textContent?.trim() || '',
              bookingUrl: bookingUrl
            });
          }
        });
      });
      
      return listings;
    });

    await browser.close();
    return roomListings;
  } catch (error) {
    console.error('Scraper error:', error);
    return [];
  }
}

// Only execute if this file is being run directly
if (require.main === module) {
  // Get command line arguments
  const args = process.argv.slice(2);
  if (args.length !== 3) {
    console.error('Usage: node test.js <destination> <checkInDate> <checkOutDate>');
    process.exit(1);
  }

  // Call main function with arguments
  main(args[0], args[1], args[2])
    .then(results => {
      process.stdout.write(JSON.stringify(results));
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = main; 