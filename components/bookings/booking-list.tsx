'use client'

import { Booking } from '@/app/types/booking'
import { BookingCard } from './booking-card'
import { Loader2 } from 'lucide-react'

interface BookingListProps {
  bookings: Booking[]
  loading: boolean
  onRebookNow: (booking: Booking) => void
}

export function BookingList({ bookings, loading, onRebookNow }: BookingListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading your bookings...</p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No bookings found. Start tracking a hotel to see it here.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          hotel={booking.hotel_name}
          location={booking.location}
          dates={`${new Date(booking.check_in_date).toLocaleDateString()} - ${new Date(booking.check_out_date).toLocaleDateString()}`}
          originalPrice={booking.original_price}
          currentPrice={booking.current_price}
          savings={booking.savings}
          image={booking.image_url}
          onRebookNow={() => onRebookNow(booking)}
        />
      ))}
    </div>
  )
} 