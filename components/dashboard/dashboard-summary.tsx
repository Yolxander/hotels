'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Booking } from '@/app/types/booking'

interface DashboardSummaryProps {
  onTrackNewHotel: () => void
}

export function DashboardSummary({ onTrackNewHotel }: DashboardSummaryProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            room_listings (
              base_price,
              total_price
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Process bookings to include lowest prices and savings
        const processedBookings = data.map((booking: any) => {
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

        setBookings(processedBookings || [])
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user])

  const activeTrackers = bookings.length
  const priceDrops = bookings.filter(booking => booking.savings > 0).length
  const totalSavings = bookings.reduce((sum, booking) => sum + (booking.savings > 0 ? booking.savings : 0), 0)

  if (loading) {
    return (
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm h-full">
        <div className="p-6 flex flex-col h-full">
          <h2 className="text-2xl font-semibold mb-4">Price Tracking Overview</h2>
          <div className="space-y-4 flex-grow">
            <div className="border rounded-xl p-4 animate-pulse bg-gray-100 h-20"></div>
            <div className="border rounded-xl p-4 animate-pulse bg-gray-100 h-20"></div>
            <div className="border rounded-xl p-4 animate-pulse bg-gray-100 h-20"></div>
          </div>
          <Button
            onClick={onTrackNewHotel}
            className="w-full rounded-full mt-4"
            disabled
          >
            Track New Hotel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm h-full">
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-2xl font-semibold mb-4">Price Tracking Overview</h2>
        <div className="space-y-4 flex-grow">
          <div className="border rounded-xl p-4">
            <h3 className="font-medium">Active Trackers</h3>
            <p className="text-2xl font-semibold">{activeTrackers}</p>
          </div>
          <div className={`border rounded-xl p-4 ${priceDrops > 0 ? 'bg-yellow-300 border-yellow-100' : ''}`}>
            <h3 className={`font-medium ${priceDrops > 0 ? 'text-black' : ''}`}>Price Drops Found</h3>
            <p className={`text-2xl font-semibold ${priceDrops > 0 ? 'text-black' : ''}`}>{priceDrops}</p>
          </div>
          <div className="border rounded-xl p-4">
            <h3 className="font-medium">Potential Savings</h3>
            <p className="text-2xl font-semibold underline decoration-4 decoration-yellow-300">${totalSavings}</p>
          </div>
        </div>
        <Button
          onClick={onTrackNewHotel}
          className="w-full rounded-full mt-4"
        >
          Track New Hotel
        </Button>
      </div>
    </div>
  )
} 