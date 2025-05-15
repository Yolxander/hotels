import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  let browser;
  try {
    console.log('Starting scraping process...');
    
    // Parse request body with error handling
    let requestBody;
    try {
      const text = await request.text();
      console.log('Raw request body:', text);
      requestBody = JSON.parse(text);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid request body. Please provide valid JSON.' },
        { status: 400 }
      );
    }

    const { destination, checkIn, checkOut, travelers } = requestBody;
    
    // Validate required fields
    if (!destination || !checkIn || !checkOut || !travelers) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, checkIn, checkOut, and travelers are required.' },
        { status: 400 }
      );
    }

    console.log('Search parameters:', { destination, checkIn, checkOut, travelers });

    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-site-isolation-trials',
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-http2',
        '--no-first-run',
        '--no-zygote',
        '--disable-notifications',
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-popup-blocking',
        '--disable-infobars',
        '--disable-save-password-bubble',
        '--disable-translate',
        '--disable-sync',
        '--disable-background-networking',
        '--metrics-recording-only',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-component-extensions-with-background-pages',
        '--disable-features=TranslateUI,BlinkGenPropertyTrees',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--force-color-profile=srgb',
        '--hide-scrollbars',
        '--mute-audio'
      ]
    });

    console.log('Browser launched successfully');

    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-CA,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1'
    });

    // Set default timeout
    await page.setDefaultNavigationTimeout(30000);

    // Add script to modify navigator properties
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-CA', 'en'] });
      Object.defineProperty(navigator, 'platform', { get: () => 'MacIntel' });
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
      Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });
      Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 0 });
    });

    // Try to navigate directly to ca.hotels.com
    console.log('Attempting to navigate...');
    
    try {
      await page.goto('https://ca.hotels.com', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      console.log('Successfully navigated to ca.hotels.com');

      // Wait for the page to be fully loaded first
      await page.waitForFunction(() => {
        return document.readyState === 'complete' && 
               !document.querySelector('.loading') && 
               document.body.children.length > 0;
      }, { timeout: 30000 });

      // Add a small delay to ensure dynamic content is loaded
      await delay(2000);

      // Debug: Log the page content
      const pageContent = await page.content();
      console.log('Page content length:', pageContent.length);
      
      // Debug: Check if form exists
      const formExists = await page.evaluate(() => {
        const form = document.querySelector('#lodging_search_form');
        const section = document.querySelector('#lodging-search-form-1');
        return {
          formExists: !!form,
          sectionExists: !!section,
          formHTML: form ? form.outerHTML : null,
          sectionHTML: section ? section.outerHTML : null
        };
      });
      console.log('Form debug info:', formExists);

      // Try to find the form using multiple strategies
      try {
        // First try the specific form ID
        await page.waitForSelector('#lodging_search_form', { timeout: 5000 });
        console.log('Found form by ID');
      } catch (error) {
        console.log('Form not found by ID, trying section...');
        try {
          // Then try the section containing the form
          await page.waitForSelector('#lodging-search-form-1', { timeout: 5000 });
          console.log('Found form section');
        } catch (error) {
          console.log('Section not found, trying generic form...');
          try {
            // Then try any form element
            await page.waitForSelector('form', { timeout: 5000 });
            console.log('Found generic form');
          } catch (error) {
            console.log('No form found, trying search-related elements...');
            // Finally try search-related elements
            await page.waitForSelector('[data-stid*="search"]', { timeout: 5000 });
            console.log('Found search-related elements');
          }
        }
      }

      // Verify we're on the correct domain
      const currentUrl = page.url();
      console.log('Current URL:', currentUrl);
      
      if (!currentUrl.includes('ca.hotels.com')) {
        throw new Error(`Expected ca.hotels.com but got ${currentUrl}`);
      }

      // Take a screenshot for debugging
      await page.screenshot({ path: 'debug-screenshot.png' });
      console.log('Screenshot taken for debugging');

      // Get all forms and their elements with more detailed logging
      const forms = await page.evaluate(() => {
        const forms = Array.from(document.forms);
        console.log('Found forms:', forms.length);
        return forms.map(form => ({
          id: form.id,
          className: form.className,
          action: form.action,
          method: form.method,
          elements: Array.from(form.elements).map(element => ({
            type: element.type,
            name: element.name,
            id: element.id,
            className: element.className,
            placeholder: element.placeholder,
            value: element.value,
            tagName: element.tagName,
            dataStid: element.getAttribute('data-stid'),
            attributes: Array.from(element.attributes).map(attr => ({
              name: attr.name,
              value: attr.value
            }))
          }))
        }));
      });
      console.log('Forms found:', forms.length);

      // Get all elements with data-stid attributes
      const elementsWithDataStid = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('[data-stid]'));
        return elements.map(element => ({
          tagName: element.tagName,
          className: element.className,
          id: element.id,
          dataStid: element.getAttribute('data-stid'),
          text: element.textContent?.trim(),
          attributes: Array.from(element.attributes).map(attr => ({
            name: attr.name,
            value: attr.value
          }))
        }));
      });

      // Get all input elements
      const inputs = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input, [role="textbox"], [contenteditable="true"]'));
        return inputs.map(input => ({
          type: input.type,
          name: input.name,
          id: input.id,
          className: input.className,
          placeholder: input.placeholder,
          value: input.value,
          tagName: input.tagName,
          role: input.getAttribute('role'),
          contentEditable: input.getAttribute('contenteditable'),
          dataStid: input.getAttribute('data-stid'),
          attributes: Array.from(input.attributes).map(attr => ({
            name: attr.name,
            value: attr.value
          }))
        }));
      });

      // Get all buttons
      const buttons = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, [role="button"], .uitk-button, [data-stid*="button"]'));
        return buttons.map(button => ({
          type: button.type,
          name: button.name,
          id: button.id,
          className: button.className,
          text: button.textContent?.trim(),
          tagName: button.tagName,
          role: button.getAttribute('role'),
          dataStid: button.getAttribute('data-stid'),
          attributes: Array.from(button.attributes).map(attr => ({
            name: attr.name,
            value: attr.value
          }))
        }));
      });

      console.log('Successfully gathered page elements');
      return NextResponse.json({ 
        forms,
        elementsWithDataStid,
        inputs,
        buttons,
        pageUrl: currentUrl
      });

    } catch (error) {
      console.log('Failed direct navigation:', error);
      throw new Error('Failed to navigate to ca.hotels.com');
    }

  } catch (error) {
    console.error('Detailed scraping error:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to scrape hotel information. Please try again later.' },
      { status: 500 }
    );
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
      console.log('Browser closed');
    }
  }
} 