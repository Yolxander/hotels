'use client'

import { BookingCard } from './booking-card'
import { Booking } from '@/app/types/booking'

interface BookingListProps {
  bookings: Booking[]
  loading: boolean
  onRebookNow: (booking: Booking) => void
  onTrackingUpdate: () => void
}

export function BookingList({ bookings, loading, onRebookNow, onTrackingUpdate }: BookingListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
        <p className="mt-2 text-sm text-gray-500">Start tracking a hotel to see it here.</p>
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
          dates={`${booking.check_in_date} - ${booking.check_out_date}`}
          originalPrice={booking.original_price}
          currentPrice={booking.current_price}
          savings={booking.savings}
          image={booking.image_url || "/placeholder.svg"}
          hasRoomListings={booking.hasRoomListings}
          bookingId={booking.id}
          isTracking={booking.is_tracking || false}
          onRebookNow={() => onRebookNow(booking)}
          onTrackingUpdate={onTrackingUpdate}
        />
      ))}
    </div>
  )
} 