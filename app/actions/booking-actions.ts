import { supabase } from '@/lib/supabase';
import { fetchHotelImages, ProcessedHotelPrice } from './hotel-actions';

export interface Booking {
  id: string;
  user_id: string;
  hotel_name: string;
  location: string;
  check_in_date: string;
  check_out_date: string;
  original_price: number;
  current_price: number;
  savings: number;
  room_type: string;
  image_url: string | null;
  is_discovered: boolean;
  created_at: string;
  updated_at: string;
  hasRoomListings: boolean;
}

export interface RoomListing {
  booking_id: string;
  provider: string;
  room_type: string;
  features: string[];
  base_price: number;
  total_price: number;
  booking_url: string;
  created_at: string;
}

export async function fetchUserBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      room_listings (
        base_price,
        total_price
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Process bookings to include lowest prices
  return data.map((booking: any) => {
    const roomListings = booking.room_listings || [];
    const lowestPrice = roomListings.length > 0 
      ? Math.min(...roomListings.map((listing: any) => listing.total_price))
      : booking.current_price;

    return {
      ...booking,
      current_price: lowestPrice,
      savings: booking.original_price - lowestPrice,
      hasRoomListings: roomListings.length > 0
    };
  });
}

export async function createBooking(params: {
  userId: string;
  hotelName: string;
  location: string;
  checkInDate: Date;
  checkOutDate: Date;
  originalPrice: number;
  roomType: string;
  imageUrl?: string | null;
}): Promise<Booking> {
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      user_id: params.userId,
      hotel_name: params.hotelName,
      location: params.location,
      check_in_date: params.checkInDate.toISOString().split('T')[0],
      check_out_date: params.checkOutDate.toISOString().split('T')[0],
      original_price: params.originalPrice,
      current_price: params.originalPrice,
      savings: 0,
      room_type: params.roomType,
      image_url: params.imageUrl,
      is_discovered: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }

  return booking;
}

export async function saveRoomListings(bookingId: string, listings: ProcessedHotelPrice[]): Promise<void> {
  console.log('Saving room listings:', { bookingId, listings });

  const formattedListings = listings.map(listing => ({
    booking_id: bookingId,
    provider: listing.provider || 'Unknown Provider',
    room_type: listing.type || 'Standard Room',
    features: listing.features || [],
    base_price: listing.basePriceValue || 0,
    total_price: listing.totalPriceValue || 0,
    booking_url: listing.url || '',
    created_at: new Date().toISOString()
  }));

  console.log('Formatted listings for database:', formattedListings);

  const { error } = await supabase
    .from('room_listings')
    .insert(formattedListings);

  if (error) {
    console.error('Error saving room listings:', error);
    throw new Error('Failed to save room listings');
  }

  console.log('Successfully saved room listings');
}

export async function fetchRoomListings(bookingId: string): Promise<RoomListing[]> {
  const { data, error } = await supabase
    .from('room_listings')
    .select('*')
    .eq('booking_id', bookingId)
    .order('total_price', { ascending: true });

  if (error) throw error;
  return data || [];
} 