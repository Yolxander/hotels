'use client'

import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Hotel, Clock, Mail, Percent, Bell, RefreshCw, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { TrackingSetupModal } from './tracking-setup-modal'
import { EditBookingModal } from './edit-booking-modal'
import { DeleteBookingDialog } from './delete-booking-dialog'

interface BookingCardProps {
  hotel: string
  location: string
  dates: string
  originalPrice: number
  currentPrice: number
  savings: number
  image: string
  hasRoomListings: boolean
  bookingId: string
  isTracking: boolean
  onRebookNow: () => void
  onTrackingUpdate: () => void
}

export function BookingCard({
  hotel,
  location,
  dates,
  originalPrice,
  currentPrice,
  savings,
  image,
  hasRoomListings,
  bookingId,
  isTracking,
  onRebookNow,
  onTrackingUpdate
}: BookingCardProps) {
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const hasSavings = savings > 0

  const handleEmailUpdates = () => {
    setIsTrackingModalOpen(true)
  }

  return (
    <>
      <Card className="overflow-hidden rounded-3xl flex flex-col h-full">
        <div className="relative h-48">
          <img src={image || "/placeholder.svg"} alt={hotel} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 flex gap-2">
            {!hasRoomListings && (
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {hasSavings && <Badge className="absolute top-3 right-3 bg-yellow-300 text-black">Price Drop!</Badge>}
        </div>
        <CardHeader>
          <CardTitle>{hotel}</CardTitle>
          <CardDescription>{location}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{dates}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hotel className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Standard Room</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Last checked 2h ago</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-sm text-gray-500">Original Price</div>
              <div className="text-lg font-semibold">${originalPrice}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Current Price</div>
              <div className="text-lg font-semibold">${currentPrice}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Savings</div>
              <div className={`text-lg font-semibold ${hasSavings ? 'font-semibold underline decoration-4 decoration-yellow-300' : ''}`}>
                ${savings}
              </div>
            </div>
          </div>

          {hasSavings ? (
            <div className="bg-yellow-300 p-3 rounded-lg border border-yellow-100">
              <p className="text-sm text-black">
                Good news! The price for your hotel dropped from ${originalPrice} to ${currentPrice}. You may want to
                rebook and save!
              </p>
            </div>
          ) : !hasRoomListings && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
              <p className="text-sm text-black">
                {isTracking 
                  ? "We're actively monitoring prices for this booking. Check back soon for better deals!"
                  : "No cheaper rooms found at the moment. Set up a tracker to monitor price drops and get notified when better deals become available."}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full"
            onClick={handleEmailUpdates}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Updates
          </Button>
          {hasSavings ? (
            <Button onClick={onRebookNow} size="sm" className="rounded-full">
              <Percent className="h-4 w-4 mr-2" />
              Rebook Now
            </Button>
          ) : !hasRoomListings ? (
            isTracking ? (
              <Button 
                size="sm" 
                className="rounded-full bg-black hover:bg-gray-900 text-yellow-300 border border-yellow-300/20"
                onClick={() => setIsTrackingModalOpen(true)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Tracker
              </Button>
            ) : (
              <Button 
                onClick={() => setIsTrackingModalOpen(true)} 
                size="sm" 
                className="rounded-full bg-black hover:bg-gray-900 text-yellow-300 border border-yellow-300/20"
              >
                <Bell className="h-4 w-4 mr-2" />
                Set Up Tracker
              </Button>
            )
          ) : (
            <Button variant="secondary" size="sm" className="rounded-full">
              <Bell className="h-4 w-4 mr-2" />
              Notify Me
            </Button>
          )}
        </CardFooter>
      </Card>

      <TrackingSetupModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        bookingId={bookingId}
        onSuccess={onTrackingUpdate}
      />

      <EditBookingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        booking={{
          id: bookingId,
          hotel,
          location,
          dates,
          originalPrice,
          currentPrice,
          image,
        }}
      />

      <DeleteBookingDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        bookingId={bookingId}
      />
    </>
  )
} 