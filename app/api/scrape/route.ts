import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { destination, checkInDate, checkOutDate, originalPrice } = await request.json();

    if (!destination || !checkInDate || !checkOutDate || !originalPrice) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('Executing scraper with params:', { destination, checkInDate, checkOutDate, originalPrice });

    // Execute the scraper script
    const { stdout, stderr } = await execAsync(
      `node scripts/agentql/test.js "${destination}" "${checkInDate}" "${checkOutDate}"`
    );

    console.log('Raw scraper stdout:', stdout);
    if (stderr) {
      console.error('Scraper stderr:', stderr);
    }

    // Return the raw stdout for now
    return NextResponse.json({ rawData: stdout });
  } catch (error) {
    console.error('Error in scrape route:', error);
    return NextResponse.json(
      { error: 'Failed to scrape hotel data' },
      { status: 500 }
    );
  }
} 