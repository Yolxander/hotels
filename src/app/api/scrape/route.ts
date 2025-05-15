import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function POST(request: Request) {
  try {
    const { destination, checkIn, checkOut, travelers } = await request.json();

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to hotels.com
    await page.goto('https://www.hotels.com');

    // Fill in the search form
    await page.fill('input[placeholder="Where to?"]', destination);
    await page.click('button[data-stid="destination_form_field-menu-trigger"]');
    await page.waitForTimeout(1000); // Wait for suggestions to load
    await page.keyboard.press('Enter');

    // Fill in dates
    await page.fill('input[data-testid="uitk-date-selector-input1-default"]', `${checkIn} - ${checkOut}`);
    await page.keyboard.press('Enter');

    // Fill in travelers
    await page.fill('input[placeholder="Travellers"]', travelers);
    await page.keyboard.press('Enter');

    // Click search button
    await page.click('button#search_button');

    // Wait for results to load
    await page.waitForSelector('div[data-stid="property-listing-results"]');

    // Get the first hotel result URL
    const firstHotelUrl = await page.evaluate(() => {
      const firstHotel = document.querySelector('div[data-stid="property-listing-results"] a[data-stid="open-hotel-information"]');
      return firstHotel ? firstHotel.getAttribute('href') : null;
    });

    await browser.close();

    if (!firstHotelUrl) {
      throw new Error('No hotel results found');
    }

    return NextResponse.json({ url: firstHotelUrl });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape hotel information' },
      { status: 500 }
    );
  }
} 