'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Booking } from '@/app/types/booking'
import { BookingCard } from './booking-card'
import { format } from 'date-fns'

interface BookingListProps {
  tab?: 'active' | 'saved' | 'history'
}

export function BookingList({ tab = 'active' }: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setBookings(data || [])
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user])

  const filteredBookings = bookings.filter(booking => {
    if (tab === 'active') return true
    if (tab === 'saved') return booking.savings > 0
    if (tab === 'history') return false // You can implement history logic here
    return true
  })

  if (loading) {
    return <div>Loading bookings...</div>
  }

  if (filteredBookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>
          {tab === 'active' && 'No active bookings found.'}
          {tab === 'saved' && 'No price drops found.'}
          {tab === 'history' && 'No booking history found.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredBookings.map((booking) => (
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