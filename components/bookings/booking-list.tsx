'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Booking } from '@/app/types/booking'
import { BookingCard } from './booking-card'
import { format } from 'date-fns'

interface BookingListProps {
  bookings: Booking[]
  loading: boolean
}

export function BookingList({ bookings, loading }: BookingListProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No bookings found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          hotel={booking.hotel_name}
          location={booking.location}
          dates={`${format(new Date(booking.check_in_date), 'MMM d')} - ${format(new Date(booking.check_out_date), 'MMM d, yyyy')}`}
          originalPrice={booking.original_price}
          currentPrice={booking.current_price}
          savings={booking.savings}
          image={booking.image_url || '/placeholder.svg?height=200&width=400'}
        />
      ))}
    </div>
  )
} 