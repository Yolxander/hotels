"use client"

import { useState } from "react"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface HotelTrackerFormProps {
  standalone?: boolean
}

export function HotelTrackerForm({ standalone = false }: HotelTrackerFormProps) {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState("2")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="space-y-4">
      {!standalone && (
        <>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="check-in">Check In</Label>
              <div className="text-sm text-gray-500">
                {checkIn ? format(checkIn, "dd - MM - yyyy") : "27 - 08 - 2023"}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal hidden",
                    !checkIn && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="check-out">Check Out</Label>
              <div className="text-sm text-gray-500">
                {checkOut ? format(checkOut, "dd - MM - yyyy") : "30 - 08 - 2023"}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal hidden",
                    !checkOut && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="guests">Guests</Label>
              <div className="text-sm text-gray-500">{guests} Adult(s)</div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="w-full hidden">
                <SelectValue placeholder="Select guests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Adult</SelectItem>
                <SelectItem value="2">2 Adults</SelectItem>
                <SelectItem value="3">3 Adults</SelectItem>
                <SelectItem value="4">4 Adults</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full rounded-full">Book Homestay</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Hotel Price Tracker</DialogTitle>
                <DialogDescription>Enter your booking details and we'll track price changes for you.</DialogDescription>
              </DialogHeader>
              <TrackingForm
                onSubmit={() => {
                  setIsDialogOpen(false)
                  setSubmitted(true)
                }}
              />
            </DialogContent>
          </Dialog>
        </>
      )}

      {standalone &&
        (submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Tracking Started!</h3>
            <p className="text-gray-600 mb-4">
              We'll monitor this hotel and alert you if prices drop. Check your email for confirmation.
            </p>
            <Button onClick={() => setSubmitted(false)}>Track Another Hotel</Button>
          </div>
        ) : (
          <TrackingForm onSubmit={() => setSubmitted(true)} />
        ))}
    </div>
  )
}

interface TrackingFormProps {
  onSubmit: () => void
}

function TrackingForm({ onSubmit }: TrackingFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="hotel-name">Hotel Name</Label>
          <Input id="hotel-name" placeholder="Enter hotel name" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="check-in-date">Check-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Select date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="check-out-date">Check-out Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Select date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="room-type">Room Type</Label>
          <Input id="room-type" placeholder="e.g. Standard Double, Deluxe Suite" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price-paid">Price Paid</Label>
          <Input id="price-paid" placeholder="e.g. 320" type="number" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email for Alerts</Label>
          <Input id="email" placeholder="your@email.com" type="email" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button type="submit" onClick={onSubmit}>
          Start Tracking Prices
        </Button>
        <p className="text-xs text-center text-gray-500 mt-2">
          We'll check prices every 6-12 hours and email you if we find a better deal.
        </p>
      </div>
    </div>
  )
}
