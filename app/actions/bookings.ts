'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function updateBooking(bookingId: string, data: {
  hotel: string
  location: string
  dates: string
  originalPrice: number
  currentPrice: number
  image: string
}) {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({
        hotel: data.hotel,
        location: data.location,
        dates: data.dates,
        original_price: data.originalPrice,
        current_price: data.currentPrice,
        image: data.image,
      })
      .eq('id', bookingId)

    if (error) throw error

    revalidatePath('/bookings')
    return { success: true }
  } catch (error) {
    console.error('Error updating booking:', error)
    return { success: false, error: 'Failed to update booking' }
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId)

    if (error) throw error

    revalidatePath('/bookings')
    return { success: true }
  } catch (error) {
    console.error('Error deleting booking:', error)
    return { success: false, error: 'Failed to delete booking' }
  }
} 