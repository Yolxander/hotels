import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
  try {
    const { destination } = await request.json();
    console.log('Scraping hotel images for:', destination);

    const browser = await puppeteer.launch({
      headless: false, // Make browser visible
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
    });

    const page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate directly to Google Travel search
    const searchUrl = `https://www.google.com/travel/search?q=${encodeURIComponent(destination)}&ts=CAEaRwopEicyJTB4OGVhOGFhNGZkZGI2NTI0YjoweDdmMjhmNzI2MDY5MTRlN2YSGhIUCgcI6Q8QCBgTEgcI6Q8QCBgUGAEyAhAA&qs=CAEyE0Nnb0lfNXpGdE9Ea3ZaUl9FQUU4AkIJCX9OkQYm9yh_QgkJf06RBib3KH8&ap=ugEHZGV0YWlscw&ictx=111`;
    
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

    // Extract hotel images
    const hotelImages = await page.evaluate(() => {
      const imageElements = document.querySelectorAll('div.WTvau.hLDzN img.x7VXS');
      const images = Array.from(imageElements).map(img => ({
        url: img.getAttribute('src') || '',
        alt: img.getAttribute('alt') || '',
        caption: img.closest('.nPreBb')?.querySelector('.O21HYe')?.textContent || ''
      }));
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

    console.log('Returning hotel images:', hotelImages);
    return NextResponse.json({ hotelImages });
  } catch (error) {
    console.error('Error scraping hotel images:', error);
    return NextResponse.json(
      { error: 'Failed to scrape hotel images' },
      { status: 500 }
    );
  }
} 