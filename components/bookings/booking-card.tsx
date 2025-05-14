'use client'

import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Hotel, Clock, Mail, Percent, Bell } from 'lucide-react'

interface BookingCardProps {
  hotel: string
  location: string
  dates: string
  originalPrice: number
  currentPrice: number
  savings: number
  image: string
}

export function BookingCard({
  hotel,
  location,
  dates,
  originalPrice,
  currentPrice,
  savings,
  image,
}: BookingCardProps) {
  const hasSavings = savings > 0

  return (
    <Card className="overflow-hidden rounded-3xl">
      <div className="relative h-48">
        <img src={image || "/placeholder.svg"} alt={hotel} className="w-full h-full object-cover" />
        {hasSavings && <Badge className="absolute top-3 right-3 bg-green-500">Price Drop!</Badge>}
      </div>
      <CardHeader>
        <CardTitle>{hotel}</CardTitle>
        <CardDescription>{location}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Original Price</div>
              <div className="font-semibold">${originalPrice}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Current Price</div>
              <div className={`font-semibold ${hasSavings ? "text-green-600" : ""}`}>${currentPrice}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Savings</div>
              <div className={`font-semibold ${hasSavings ? "text-green-600" : ""}`}>${savings}</div>
            </div>
          </div>
        </div>

        {hasSavings && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <p className="text-sm text-green-800">
              Good news! The price for your hotel dropped from ${originalPrice} to ${currentPrice}. You may want to
              rebook and save!
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" className="rounded-full">
          <Mail className="h-4 w-4 mr-2" />
          Email Updates
        </Button>
        {hasSavings ? (
          <Button size="sm" className="rounded-full">
            <Percent className="h-4 w-4 mr-2" />
            Rebook Now
          </Button>
        ) : (
          <Button variant="secondary" size="sm" className="rounded-full">
            <Bell className="h-4 w-4 mr-2" />
            Notify Me
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 