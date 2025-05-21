import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && contentType !== null && contentType.startsWith('image/');
  } catch (error) {
    console.error('Error validating image URL:', url, error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { destination } = await request.json();
    console.log('Scraping hotel images for:', destination);

    const browser = await puppeteer.launch({
      headless: true, // Make browser visible
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
    });

    const page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate directly to Google Travel search with dynamic destination
    const searchUrl = `https://www.google.com/travel/search?q=${encodeURIComponent(destination)}`;
    
    console.log('Navigating to:', searchUrl);
    await page.goto(searchUrl, { waitUntil: 'networkidle0' });
    console.log('Page loaded');

    // Wait for and click the Photos tab
    await page.waitForSelector('div[jsname="AznF2e"][aria-label="Photos"]', { timeout: 15000 });
    console.log('Found Photos tab');
    
    await page.click('div[jsname="AznF2e"][aria-label="Photos"]');
    console.log('Clicked Photos tab');

    // Wait for the photos section to load
    await page.waitForSelector('div.WTvau.hLDzN', { timeout: 15000 });
    console.log('Photos section loaded');

    // Function to count non-gvs-cs images
    const countNonGvsImages = async () => {
      return await page.evaluate(() => {
        const images = document.querySelectorAll('div.WTvau.hLDzN img.x7VXS');
        return Array.from(images).filter(img => {
          const url = img.getAttribute('src') || '';
          return url.startsWith('https://lh3.googleusercontent.com/') ;
        }).length;
      });
    };

    // Click "Show more" until we have enough non-gvs-cs images or no more can be loaded
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loop
    while (attempts < maxAttempts) {
      const nonGvsCount = await countNonGvsImages();
      if (nonGvsCount >= 6) break;

      const showMoreButton = await page.$('div[jsname="oZzHLe"]');
      if (!showMoreButton) break;

      try {
        await showMoreButton.click();
        await page.waitForFunction(() => {
          const images = document.querySelectorAll('div.WTvau.hLDzN img.x7VXS');
          return images.length > 0;
        }, { timeout: 2000 });
        attempts++;
      } catch (error) {
        console.log('No more images to load');
        break;
      }
    }

    // Extract hotel images
    const hotelImages = await page.evaluate(() => {
      const imageElements = document.querySelectorAll('div.WTvau.hLDzN img.x7VXS');
      const images = Array.from(imageElements)
        .map(img => {
          const url = img.getAttribute('src') || '';
          
          // Only process non-gvs-cs images
          if (url.startsWith('https://lh3.googleusercontent.com/') && !url.includes('gvs-cs/')) {
            // Ensure consistent URL format by removing any size parameters and adding =s0
            const baseUrl = url.split('=')[0];
            const completeUrl = `${baseUrl}=s0`; // Add =s0 to get original size
            
            return {
              url: completeUrl,
              alt: img.getAttribute('alt') || '',
              caption: img.closest('.nPreBb')?.querySelector('.O21HYe')?.textContent || ''
            };
          }
          return null;
        })
        .filter((img): img is NonNullable<typeof img> => img !== null)
        .slice(0, 6); // Take only the first 6 images

      console.log('Found images:', images);
      return images;
    });

    // Wait a bit before closing to see the results
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await browser.close();
    console.log('Browser closed');

    if (!hotelImages || hotelImages.length === 0) {
      console.log('No hotel images found');
      return NextResponse.json({ error: 'Could not find hotel images' }, { status: 404 });
    }

    // Validate image URLs
    console.log('Validating image URLs...');
    const validatedImages = await Promise.all(
      hotelImages.map(async (image) => {
        const isValid = await validateImageUrl(image.url);
        return isValid ? image : null;
      })
    );

    // Filter out invalid images
    const validImages = validatedImages.filter((image): image is typeof image => image !== null);

    if (validImages.length === 0) {
      console.log('No valid hotel images found after validation');
      return NextResponse.json({ error: 'Could not find valid hotel images' }, { status: 404 });
    }

    console.log('Returning validated hotel images:', validImages);
    return NextResponse.json({ hotelImages: validImages });
  } catch (error) {
    console.error('Error scraping hotel images:', error);
    return NextResponse.json(
      { error: 'Failed to scrape hotel images' },
      { status: 500 }
    );
  }
} 