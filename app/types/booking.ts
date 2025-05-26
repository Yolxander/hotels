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