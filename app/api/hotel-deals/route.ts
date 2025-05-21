import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

interface HotelSuggestion {
  name: string;
  price: string;
  rating: string;
  reviews: string;
  deal: string;
  url: string;
  image: string;
  location: string;
  amenities: string[];
  description: string;
}

export async function POST(request: Request) {
  try {
    const { destination, checkIn, checkOut, travelers } = await request.json();
    console.log('Starting scraper with parameters:', { destination, checkIn, checkOut, travelers });

    // Format dates to "Month Day" format
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', { month: 'long', day: 'numeric' });
    };

    const browser = await chromium.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--hide-scrollbars',
        '--disable-notifications',
        '--disable-extensions',
        '--force-color-profile=srgb',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-site-isolation-trials',
        '--disable-blink-features=AutomationControlled',
        '--incognito'
      ]
    });
    console.log('Browser launched successfully in incognito mode');

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      locale: 'en-US',
      timezoneId: 'America/New_York',
      geolocation: { longitude: -74.006, latitude: 40.7128 },
      permissions: ['geolocation'],
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"'
      }
    });
    console.log('Browser context created with custom settings');

    // Add random delays between actions with more human-like timing
    const randomDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

    const page = await context.newPage();
    console.log('New page created');

    // Override navigator.webdriver to prevent detection
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
      });
    });
    console.log('Webdriver detection disabled');

    // Enable request interception with more selective blocking
    await page.route('**/*', async (route) => {
      const request = route.request();
      const resourceType = request.resourceType();
      
      // Only block certain resources that aren't essential
      if (['media', 'font'].includes(resourceType)) {
        await route.abort();
      } else {
        await route.continue();
      }
    });
    console.log('Request interception enabled');

    // First visit Google homepage and wait
    console.log('Navigating to Google homepage...');
    await page.goto('https://www.google.com', { waitUntil: 'networkidle' });
    await randomDelay();
    console.log('Successfully loaded Google homepage');

    // Simulate human-like mouse movements
    await page.mouse.move(Math.random() * 500, Math.random() * 500);
    await randomDelay();
    console.log('Simulated mouse movement');

    // Type the search query with human-like delays
    const formattedCheckIn = formatDate(checkIn);
    const formattedCheckOut = formatDate(checkOut);
    const searchQuery = `best hotel deals in ${destination} ${formattedCheckIn} to ${formattedCheckOut}`;
    console.log('Preparing to search for:', searchQuery);
    
    const searchInput = await page.waitForSelector('textarea[name="q"]');
    console.log('Found search input field');
    
    // Type each character with random delays
    for (const char of searchQuery) {
      await searchInput.type(char, { delay: Math.random() * 100 + 50 });
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    }
    console.log('Finished typing search query');
    
    await randomDelay();
    await page.keyboard.press('Enter');
    await randomDelay();
    console.log('Search submitted');

    // Scroll the page randomly to simulate human behavior
    await page.evaluate(() => {
      window.scrollBy(0, Math.random() * 100);
    });
    await randomDelay();
    console.log('Page scrolled');

    // Wait for the hotel suggestions to load with increased timeout
    console.log('Waiting for hotel suggestions to load...');
    try {
      await page.waitForSelector('div[aria-label="Hotel suggestions"]', { timeout: 30000 });
      console.log('Hotel suggestions container found');
    } catch (error) {
      console.error('Hotel suggestions not found:', error);
      await browser.close();
      return NextResponse.json(
        { error: 'No hotel suggestions found. The search might have been blocked.' },
        { status: 404 }
      );
    }

    // Extract hotel suggestions
    console.log('Extracting hotel suggestions...');
    const hotelSuggestions = await page.evaluate(() => {
      const suggestions: HotelSuggestion[] = [];
      const hotelElements = document.querySelectorAll('div[aria-label="Hotel suggestions"] a');
      console.log(`Found ${hotelElements.length} hotel elements`);
      
      hotelElements.forEach((element, index) => {
        const anchor = element as HTMLAnchorElement;
        
        // Extract image URL
        const imgElement = element.querySelector('img');
        const imageUrl = imgElement?.src || imgElement?.getAttribute('data-src') || '';
        
        // Extract location
        const locationElement = element.querySelector('.YwF3uc .RDApEe');
        const location = locationElement?.textContent || '';
        
        // Extract amenities
        const amenitiesElements = element.querySelectorAll('.YwF3uc .RDApEe');
        const amenities = Array.from(amenitiesElements)
          .map(el => el.textContent || '')
          .filter(text => text && !text.includes('reviews') && !text.includes('stars'));
        
        // Extract description
        const descriptionElement = element.querySelector('.YwF3uc .RDApEe');
        const description = descriptionElement?.textContent || '';

        const hotelData: HotelSuggestion = {
          name: element.querySelector('.mtlZOe .BTPx6e')?.textContent || '',
          price: element.querySelector('.YwF3uc .sRlU8b')?.textContent || '',
          rating: element.querySelector('.j4Tqqd .Y0A0hc')?.textContent || '',
          reviews: element.querySelector('.RDApEe')?.textContent || '',
          deal: element.querySelector('.dLtZ8b')?.textContent || '',
          url: anchor.href || '',
          image: imageUrl,
          location: location,
          amenities: amenities,
          description: description
        };
        console.log(`Hotel ${index + 1}:`, hotelData);
        suggestions.push(hotelData);
      });

      return suggestions;
    });

    console.log('Found hotel suggestions:', hotelSuggestions);
    await browser.close();
    console.log('Browser closed');

    if (!hotelSuggestions || hotelSuggestions.length === 0) {
      console.log('No hotel suggestions found in the results');
      return NextResponse.json(
        { error: 'No hotel suggestions found' },
        { status: 404 }
      );
    }

    console.log(`Successfully scraped ${hotelSuggestions.length} hotel suggestions`);
    return NextResponse.json({ hotelSuggestions });
  } catch (error) {
    console.error('Error scraping hotel deals:', error);
    return NextResponse.json(
      { error: 'Failed to scrape hotel deals' },
      { status: 500 }
    );
  }
} 