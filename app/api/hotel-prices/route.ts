import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function POST(request: Request) {
  try {
    const { hotelName, location, checkInDate, checkOutDate } = await request.json();

    if (!hotelName || !location || !checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

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

    await context.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    });

    const page = await context.newPage();

    // Navigate directly to Google Travel search with both hotel name and location
    const searchQuery = `${hotelName} ${location}`;
    const searchUrl = `https://www.google.com/travel/search?q=${encodeURIComponent(searchQuery)}`;
    console.log('Navigating to:', searchUrl);
    await page.goto(searchUrl, { waitUntil: 'networkidle' });

    // Wait for search results
    await page.waitForTimeout(3000);

    // Click on the Prices tab
    try {
      console.log('Looking for Prices tab...');
      const pricesTab = await page.waitForSelector('[aria-label="Prices"]', { timeout: 5000 });
      if (pricesTab) {
        console.log('Found Prices tab, clicking...');
        await pricesTab.click();
      }
    } catch (error) {
      console.error('Error clicking prices tab:', error);
    }

    // Wait for prices to load
    await page.waitForTimeout(3000);

    // Get price listings
    console.log('Scraping price listings...');
    const priceListings = await page.evaluate(() => {
      interface PriceListing {
        // provider: string;
        // providerInfo: {
        //   logo: string;
        //   features: string[];
        //   support: string[];
        //   memberDeals?: string;
        // };
        rooms: Array<{
          type: string;
          basePrice: string;
          totalPrice: string;
          url: string;
          cancellationPolicy?: string;
          features?: string[];
        }>;
      }
      
    // Find the first div that contains at least one 'a' with href starting with "/aclk?"
const providerSection = Array.from(document.querySelectorAll('div')).find(div =>
    div.querySelector('a[href^="/aclk?"]')
  );
  if (!providerSection) {
    console.log('No provider section found');
    return [];
  }
  

      // Get provider name using text-based identification
      const providerName = Array.from(providerSection.querySelectorAll('span'))
        .map(s => s.textContent?.trim())
        .find(t => t && (
          t.toLowerCase().includes('.com') ||
          t.toLowerCase().includes('booking') ||
          t.toLowerCase().includes('expedia') ||
          t.toLowerCase().includes('priceline')
        )) || 'Unknown Provider';

      // Get provider logo from first img tag
      const providerLogo = providerSection.querySelector('img')?.getAttribute('src') || '';
      console.log('Found provider:', providerName);
      console.log('Provider logo:', providerLogo);

      // Get provider features and info
      const features: string[] = [];
      const support: string[] = [];
      let memberDeals: string | undefined;

      Array.from(providerSection.querySelectorAll('span')).forEach(span => {
        const text = span.textContent?.trim() || '';
        if (!text) return;
      
        if (text.includes('Customer support:')) {
          const supportItems = text.replace('Customer support:', '')
            .split('·')
            .map(item => item.trim())
            .filter(Boolean);
          support.push(...supportItems);
          console.log('Found support options:', supportItems);
        } else if (
          text.toLowerCase().includes('member deal') ||
          text.toLowerCase().includes('member price')
        ) {
          memberDeals = text;
          console.log('Found member deals:', text);
        } else {
          // Optionally filter out price spans (starts with "$" or "nightly")
          if (/^\$/.test(text) || text.toLowerCase().includes('nightly')) return;
          features.push(text);
          console.log('Found feature:', text);
        }
      });
      
      // Get all room listings using the correct selector
      const rooms = Array.from(providerSection.querySelectorAll('a[href^="/aclk?"]')).map(room => {
        // Get room type using structural selectors
        let type = null;
        try {
          type = room.children[0]?.children[0]?.querySelector('div')?.textContent?.trim() ||
                 room.querySelector('div > div > div')?.textContent?.trim() ||
                 'Unknown Room Type';
        } catch (e) {
          type = 'Unknown Room Type';
        }
        console.log('\nProcessing room:', type);
        
        // Get prices using text-based identification
        const allSpans = Array.from(room.querySelectorAll('span'));
        const basePrice = allSpans
          .map(s => s.textContent?.trim())
          .find(t => t && t.includes('$') && !t.toLowerCase().includes('taxes')) || '';
        
        const totalPrice = allSpans
          .map(s => s.textContent?.trim())
          .find(t => t && t.includes('$') && t.toLowerCase().includes('taxes')) || basePrice;
        
        console.log('Base price:', basePrice);
        console.log('Total price:', totalPrice);

        // Get cancellation policy and features
        const roomFeatures: string[] = [];
        let cancellationPolicy: string | undefined;

        Array.from(providerSection.querySelectorAll('span')).forEach(span => {
  const text = span.textContent?.trim() || '';
  if (!text) return;

  if (text.includes('Customer support:')) {
    const supportItems = text.replace('Customer support:', '')
      .split('·')
      .map(item => item.trim())
      .filter(Boolean);
    support.push(...supportItems);
    console.log('Found support options:', supportItems);
  } else if (
    text.toLowerCase().includes('member deal') ||
    text.toLowerCase().includes('member price')
  ) {
    memberDeals = text;
    console.log('Found member deals:', text);
  } else {
    // Optionally filter out price spans (starts with "$" or "nightly")
    if (/^\$/.test(text) || text.toLowerCase().includes('nightly')) return;
    features.push(text);
    console.log('Found feature:', text);
  }
});


        // Get the full URL
        const relativeUrl = room.getAttribute('href') || '';
        const url = relativeUrl.startsWith('http') ? relativeUrl : `https://www.google.com${relativeUrl}`;

        const roomData = {
          type,
          basePrice,
          totalPrice,
          url,
          cancellationPolicy,
          features: roomFeatures.length > 0 ? roomFeatures : undefined
        };
        console.log('Room data:', JSON.stringify(roomData, null, 2));
        return roomData;
      });

      const result = [{
        rooms
      }];

      console.log('Final result:', JSON.stringify(result, null, 2));
      return result;
    });

    console.log('Found price listings:', JSON.stringify(priceListings, null, 2));
    await browser.close();
    return NextResponse.json({ prices: priceListings });

  } catch (error) {
    console.error('Scraper error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotel prices' },
      { status: 500 }
    );
  }
} 