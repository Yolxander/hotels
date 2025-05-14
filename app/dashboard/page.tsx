"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  User,
  Bell,
  CalendarIcon,
  Clock,
  Hotel,
  Mail,
  Percent,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building,
  Users,
  Bed,
  CreditCard,
  FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Header } from "@/components/header"
import { BookingList } from '@/components/bookings/booking-list'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Booking } from '@/app/types/booking'

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    hotel_name: "",
    location: "",
    check_in_date: undefined as Date | undefined,
    check_out_date: undefined as Date | undefined,
    original_price: "",
  })

  const fetchBookings = async () => {
    if (!user) return
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

  useEffect(() => {
    fetchBookings()
  }, [user])

  const activeTrackers = bookings.length
  const priceDrops = bookings.filter(booking => booking.savings > 0).length

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!user) {
      alert('You must be logged in to track a booking')
      return
    }

    // Validate required fields
    if (!formData.hotel_name || !formData.location || !formData.check_in_date || !formData.check_out_date || !formData.original_price) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            hotel_name: formData.hotel_name,
            location: formData.location,
            check_in_date: formData.check_in_date.toISOString(),
            check_out_date: formData.check_out_date.toISOString(),
            original_price: parseFloat(formData.original_price),
            current_price: parseFloat(formData.original_price),
            savings: 0,
            image_url: '/placeholder.svg?height=200&width=400'
          }
        ])

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Close dialog and reset form
      setIsDialogOpen(false)
      setFormData({
        hotel_name: "",
        location: "",
        check_in_date: undefined,
        check_out_date: undefined,
        original_price: "",
      })

      // Refresh the bookings data
      await fetchBookings()
    } catch (error) {
      console.error('Error saving booking:', error)
      alert('Error saving booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setFormData({
              hotel_name: "",
              location: "",
              check_in_date: undefined,
              check_out_date: undefined,
              original_price: "",
            })
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Track a New Hotel Booking</DialogTitle>
            <DialogDescription>Enter the details of your hotel booking to start tracking price changes.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hotel-name">Hotel Name*</Label>
                <Input
                  id="hotel-name"
                  placeholder="e.g. Hilton Garden Inn"
                  value={formData.hotel_name}
                  onChange={(e) => handleInputChange("hotel_name", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location*</Label>
                <Input
                  id="location"
                  placeholder="e.g. Tokyo, Japan"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="check-in">Check-in Date*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.check_in_date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.check_in_date ? format(formData.check_in_date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.check_in_date}
                        onSelect={(date) => handleInputChange("check_in_date", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="check-out">Check-out Date*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.check_out_date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.check_out_date ? format(formData.check_out_date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.check_out_date}
                        onSelect={(date) => handleInputChange("check_out_date", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Original Price*</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="price"
                    type="number"
                    className="pl-7"
                    placeholder="e.g. 450"
                    value={formData.original_price}
                    onChange={(e) => handleInputChange("original_price", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Start Tracking'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 z-10 bg-black/50"></div>
              <Image
                src="/hotel/Lindos-Grand-Resort-pool_bu.jpg?height=600&width=1000"
                alt="Luxury hotel room"
                width={1000}
                height={1000}
                className="w-full h-[600px] object-cover"
              />

              <div className="absolute bottom-16 left-16 z-20">
                <h1 className="text-5xl font-light text-white leading-tight">
                  Your <span className="italic font-normal">Savings</span>
                  <br />
                  Dashboard
                </h1>
              </div>
            </div>

            <div className="lg:col-span-1">
              <DashboardSummary onTrackNewHotel={() => {
                setIsDialogOpen(true)
              }} />
            </div>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="bg-white rounded-full p-1 border">
                <TabsTrigger value="active" className="rounded-full">
                  Active Trackers ({activeTrackers})
                </TabsTrigger>
                <TabsTrigger value="saved" className="rounded-full">
                  Price Drops ({priceDrops})
                </TabsTrigger>
                <TabsTrigger value="history" className="rounded-full">
                  History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-6">
                <BookingList tab="active" />
              </TabsContent>
              <TabsContent value="saved" className="mt-6">
                <BookingList tab="saved" />
              </TabsContent>
              <TabsContent value="history" className="mt-6">
                <BookingList tab="history" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

interface BookingCardProps {
  hotel: string
  location: string
  dates: string
  originalPrice: number
  currentPrice: number
  savings: number
  image: string
}

function BookingCard({ hotel, location, dates, originalPrice, currentPrice, savings, image }: BookingCardProps) {
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
