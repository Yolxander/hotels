import { supabase } from '@/lib/supabase';

const API_BASE_URL = 'http://199.19.72.124:3002';

export interface HotelImage {
  url: string;
  alt: string;
  caption: string;
}

export interface HotelDeal {
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

export interface HotelPrice {
  provider: string;
  roomType: string;
  features: string[];
  basePrice: string;
  totalPrice: string;
  bookingUrl: string;
  basePriceValue: number;
  totalPriceValue: number;
  cancellationPolicy?: string;
}

export interface ProcessedHotelPrice {
  type: string;
  basePrice: string;
  totalPrice: string;
  url: string;
  totalPriceValue: number;
  basePriceValue: number;
  features: string[];
  provider: string;
}

export async function fetchHotelImages(hotelName: string): Promise<HotelImage[]> {
  const response = await fetch(`${API_BASE_URL}/api/hotel-images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      destination: hotelName
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch hotel images');
  }

  const data = await response.json();
  return data.hotelImages || [];
}

export async function fetchHotelDeals(params: {
  destination: string;
  checkIn: string;
  checkOut: string;
  travelers: string;
}): Promise<HotelDeal[]> {
  const response = await fetch(`${API_BASE_URL}/api/hotel-deals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch hotel deals');
  }

  const data = await response.json();
  return data.hotelSuggestions || [];
}

export async function fetchHotelPrices(params: {
  hotelName: string;
  location: string;
  checkInDate: string;
  checkOutDate: string;
}): Promise<HotelPrice[]> {
  const response = await fetch(`${API_BASE_URL}/api/hotel-prices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch hotel prices');
  }

  const data = await response.json();
  return data.prices || [];
}

export async function fetchTopHotels(): Promise<{
  topHotels: HotelDeal[];
  remainingHotels: HotelDeal[];
  destination: string;
}> {
  const response = await fetch(`${API_BASE_URL}/api/top-hotels`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch top hotels');
  }

  return response.json();
}

export async function saveHotelDeals(params: {
  hotelDeals: HotelDeal[];
  destination: string;
  checkIn: string;
  checkOut: string;
  travelers: string;
}): Promise<{ count: number }> {
  const response = await fetch(`${API_BASE_URL}/api/save-hotel-deals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to save hotel deals');
  }

  return response.json();
}

export async function processHotelPrices(prices: any[], roomType: string, originalPrice: number): Promise<ProcessedHotelPrice[]> {
  if (!prices || !prices[0]?.rooms) {
    return [];
  }

  console.log('Processing hotel prices:', prices);

  const rooms = prices[0].rooms;
  
  // Filter rooms by type and process prices
  const processedRooms = rooms
    .filter((room: any) => {
      // Check if room type matches (case insensitive)
      return room.type.toLowerCase().includes(roomType.toLowerCase());
    })
    .map((room: any) => {
      // Extract the last price value from the string (e.g., "$242$242$281$281" -> "281")
      const basePriceMatch = room.basePrice.match(/\$(\d+)(?=\$|$)/g);
      const totalPriceMatch = room.totalPrice.match(/\$(\d+)(?=\$|$)/g);
      
      const basePriceValue = basePriceMatch ? parseFloat(basePriceMatch[basePriceMatch.length - 1].replace('$', '')) : 0;
      // If totalPrice is 0 or not provided, use basePrice
      const totalPriceValue = totalPriceMatch ? parseFloat(totalPriceMatch[totalPriceMatch.length - 1].replace('$', '')) : basePriceValue;

      // Extract features from the room type or description
      const features = room.features || [];
      const cleanFeatures = Array.isArray(features) 
        ? features.filter(f => f && typeof f === 'string' && f.trim().length > 0)
        : [];

      return {
        type: room.type || 'Standard Room',
        basePrice: basePriceValue,
        totalPrice: totalPriceValue,
        url: room.url || '',
        totalPriceValue,
        basePriceValue,
        features: cleanFeatures,
        provider: room.provider || 'Unknown Provider'
      };
    })
    .filter((room: ProcessedHotelPrice) => {
      // Only include rooms that are cheaper than the original price
      return room.totalPriceValue < originalPrice;
    })
    // Remove duplicates based on type and totalPrice
    .filter((room: ProcessedHotelPrice, index: number, self: ProcessedHotelPrice[]) => {
      return index === self.findIndex((r) => (
        r.type === room.type && 
        r.totalPriceValue === room.totalPriceValue
      ));
    })
    .sort((a: ProcessedHotelPrice, b: ProcessedHotelPrice) => {
      // Sort by total price ascending
      return a.totalPriceValue - b.totalPriceValue;
    });

  console.log('Processed rooms (after removing duplicates):', processedRooms);
  return processedRooms;
} 