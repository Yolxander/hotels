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
        provider: string;
        providerInfo: {
          logo: string;
          features: string[];
          support: string[];
          memberDeals?: string;
        };
        rooms: Array<{
          type: string;
          basePrice: string;
          totalPrice: string;
          url: string;
          cancellationPolicy?: string;
          features?: string[];
        }>;
      }
      
      // Find the first booking provider section
      const providerSection = document.querySelector('.CcERhd.hGTXTe.qbgwxe');
      if (!providerSection) {
        console.log('No provider section found');
        return [];
      }

      // Get provider name and logo
      const providerName = providerSection.querySelector('.FjC1We')?.textContent?.trim() || 'Unknown Provider';
      const providerLogo = providerSection.querySelector('img.x7VXS')?.getAttribute('src') || '';
      console.log('Found provider:', providerName);
      console.log('Provider logo:', providerLogo);

      // Get provider features and info
      const features: string[] = [];
      const support: string[] = [];
      let memberDeals: string | undefined;

      providerSection.querySelectorAll('.JYppFe').forEach(info => {
        const text = info.textContent?.trim() || '';
        if (text.includes('Customer support:')) {
          const supportItems = text.replace('Customer support:', '').split('·').map(item => item.trim()).filter(Boolean);
          support.push(...supportItems);
          console.log('Found support options:', supportItems);
        } else if (text.includes('Member Deals')) {
          memberDeals = text;
          console.log('Found member deals:', text);
        } else {
          features.push(text);
          console.log('Found feature:', text);
        }
      });

      // Get all room listings
      const rooms = Array.from(providerSection.querySelectorAll('.gkynWe.cTvP0c.tVVare.pS9Ck')).map(room => {
        const type = room.querySelector('.EI1JTd.EA71Tc')?.textContent?.trim() || 'Unknown Room Type';
        console.log('\nProcessing room:', type);
        
        // Get prices
        const priceElements = room.querySelectorAll('.QoBrxc span');
        const basePrice = priceElements[0]?.textContent?.trim() || '';
        const totalPrice = priceElements[2]?.textContent?.trim() || basePrice;
        console.log('Base price:', basePrice);
        console.log('Total price:', totalPrice);

        // Get cancellation policy and features
        const roomFeatures: string[] = [];
        let cancellationPolicy: string | undefined;

        room.querySelectorAll('.niTXmc.x4RNH').forEach(info => {
          const text = info.textContent?.trim() || '';
          if (text.toLowerCase().includes('cancellation')) {
            cancellationPolicy = text;
            console.log('Cancellation policy:', text);
          } else {
            roomFeatures.push(text);
            console.log('Room feature:', text);
          }
        });

        const roomData = {
          type,
          basePrice,
          totalPrice,
          url: room.getAttribute('href') || '',
          cancellationPolicy,
          features: roomFeatures.length > 0 ? roomFeatures : undefined
        };
        console.log('Room data:', JSON.stringify(roomData, null, 2));
        return roomData;
      });

      const result = [{
        provider: providerName,
        providerInfo: {
          logo: providerLogo,
          features,
          support,
          memberDeals
        },
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