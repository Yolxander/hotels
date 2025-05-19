import { wrap } from 'agentql';
import { chromium, Browser, Page } from 'playwright';

export type WrappedPage = Page & {
  getByPrompt: (prompt: string) => Promise<any>;
};

export async function setupBrowser(): Promise<{ browser: Browser; page: WrappedPage }> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await wrap(await context.newPage()) as WrappedPage;
  return { browser, page };
}

export async function cleanupBrowser(browser: Browser): Promise<void> {
  if (browser) {
    await browser.close();
  }
}

export async function waitForElement(page: WrappedPage, prompt: string, timeout = 5000): Promise<void> {
  try {
    await page.waitForFunction(
      () => document.querySelector(`[data-agentql-prompt="${prompt}"]`) !== null,
      { timeout }
    );
  } catch (error) {
    throw new Error(`Element with prompt "${prompt}" not found after ${timeout}ms`);
  }
} 