"use client"

import { useState } from "react"
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

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    hotelName: "",
    hotelUrl: "",
    city: "",
    country: "",
    checkInDate: undefined as Date | undefined,
    checkOutDate: undefined as Date | undefined,
    adults: "",
    children: "",
    roomType: "",
    bedType: "",
    bookingId: "",
    pricePaid: "",
    confirmationDetails: "",
  })

  const totalSteps = 4

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Here you would handle the form submission
    console.log("Form submitted:", formData)
    setIsDialogOpen(false)
    setCurrentStep(1)
    // Reset form or show success message
  }

  const resetWizard = () => {
    if (!isDialogOpen) {
      setCurrentStep(1)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetWizard()
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Track a New Hotel Booking</DialogTitle>
            <DialogDescription>Follow the steps to start tracking price changes.</DialogDescription>
          </DialogHeader>

          {/* Wizard Progress Indicator */}
          <div className="relative mb-6">
            <div className="w-full bg-gray-200 h-1 rounded-full">
              <div
                className="bg-black h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center ${index + 1 <= currentStep ? "text-black" : "text-gray-400"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${index + 1 <= currentStep ? "bg-black text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    {index + 1 < currentStep ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">
                    {index === 0 && "Hotel"}
                    {index === 1 && "Booking"}
                    {index === 2 && "Details"}
                    {index === 3 && "Review"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Hotel Information */}
          {currentStep === 1 && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                <Building className="h-6 w-6 text-black" />
                <h2 className="text-xl font-semibold">Hotel Information</h2>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hotel-name">Hotel Name*</Label>
                  <Input
                    id="hotel-name"
                    placeholder="e.g. Hotel Daleese"
                    value={formData.hotelName}
                    onChange={(e) => handleInputChange("hotelName", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hotel-url">Hotel Website URL (optional)</Label>
                  <Input
                    id="hotel-url"
                    placeholder="e.g. https://www.hoteldaleese.com"
                    value={formData.hotelUrl}
                    onChange={(e) => handleInputChange("hotelUrl", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City*</Label>
                    <Input
                      id="city"
                      placeholder="e.g. Paris"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country*</Label>
                    <Input
                      id="country"
                      placeholder="e.g. France"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Booking Dates and Guests */}
          {currentStep === 2 && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                <CalendarIcon className="h-6 w-6 text-black" />
                <h2 className="text-xl font-semibold">Booking Dates & Guests</h2>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="check-in">Check-in Date*</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.checkInDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.checkInDate ? format(formData.checkInDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.checkInDate}
                          onSelect={(date) => handleInputChange("checkInDate", date)}
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
                            !formData.checkOutDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.checkOutDate ? format(formData.checkOutDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.checkOutDate}
                          onSelect={(date) => handleInputChange("checkOutDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <Users className="h-5 w-5 text-black" />
                  <h3 className="text-md font-medium">Guests</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="adults">Number of Adults*</Label>
                    <Select value={formData.adults} onValueChange={(value) => handleInputChange("adults", value)}>
                      <SelectTrigger id="adults">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Adult</SelectItem>
                        <SelectItem value="2">2 Adults</SelectItem>
                        <SelectItem value="3">3 Adults</SelectItem>
                        <SelectItem value="4">4 Adults</SelectItem>
                        <SelectItem value="5+">5+ Adults</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="children">Number of Children</Label>
                    <Select value={formData.children} onValueChange={(value) => handleInputChange("children", value)}>
                      <SelectTrigger id="children">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 Children</SelectItem>
                        <SelectItem value="1">1 Child</SelectItem>
                        <SelectItem value="2">2 Children</SelectItem>
                        <SelectItem value="3">3 Children</SelectItem>
                        <SelectItem value="4+">4+ Children</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <Bed className="h-5 w-5 text-black" />
                  <h3 className="text-md font-medium">Room Information</h3>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="room-type">Room Type*</Label>
                  <Input
                    id="room-type"
                    placeholder="e.g. Deluxe Double Room with Balcony"
                    value={formData.roomType}
                    onChange={(e) => handleInputChange("roomType", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bed-type">Bed Type (optional)</Label>
                  <Input
                    id="bed-type"
                    placeholder="e.g. 1 Queen Bed"
                    value={formData.bedType}
                    onChange={(e) => handleInputChange("bedType", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-black" />
                <h2 className="text-xl font-semibold">Additional Information</h2>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="booking-id">Booking ID (optional)</Label>
                  <Input
                    id="booking-id"
                    placeholder="e.g. BK12345678"
                    value={formData.bookingId}
                    onChange={(e) => handleInputChange("bookingId", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="price-paid">Total Price Paid*</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="price-paid"
                      type="number"
                      className="pl-7"
                      placeholder="e.g. 450"
                      value={formData.pricePaid}
                      onChange={(e) => handleInputChange("pricePaid", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmation">Booking Confirmation Details (optional)</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
                    <Input id="confirmation" type="file" className="hidden" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("confirmation")?.click()}
                    >
                      Select File
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Or paste confirmation details below:</p>
                  <Textarea
                    placeholder="Paste your booking confirmation details here..."
                    className="min-h-[100px]"
                    value={formData.confirmationDetails}
                    onChange={(e) => handleInputChange("confirmationDetails", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="h-6 w-6 text-black" />
                <h2 className="text-xl font-semibold">Review & Submit</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4" /> Hotel Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Hotel Name:</div>
                    <div className="font-medium">{formData.hotelName || "Not provided"}</div>

                    <div className="text-gray-500">Location:</div>
                    <div className="font-medium">
                      {formData.city && formData.country ? `${formData.city}, ${formData.country}` : "Not provided"}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" /> Booking Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Check-in:</div>
                    <div className="font-medium">
                      {formData.checkInDate ? format(formData.checkInDate, "PPP") : "Not provided"}
                    </div>

                    <div className="text-gray-500">Check-out:</div>
                    <div className="font-medium">
                      {formData.checkOutDate ? format(formData.checkOutDate, "PPP") : "Not provided"}
                    </div>

                    <div className="text-gray-500">Guests:</div>
                    <div className="font-medium">
                      {formData.adults
                        ? `${formData.adults} Adult${formData.adults !== "1" ? "s" : ""}`
                        : "Not provided"}
                      {formData.children && formData.children !== "0"
                        ? `, ${formData.children} Child${formData.children !== "1" ? "ren" : ""}`
                        : ""}
                    </div>

                    <div className="text-gray-500">Room Type:</div>
                    <div className="font-medium">{formData.roomType || "Not provided"}</div>

                    {formData.bedType && (
                      <>
                        <div className="text-gray-500">Bed Type:</div>
                        <div className="font-medium">{formData.bedType}</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Price Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Price Paid:</div>
                    <div className="font-medium">{formData.pricePaid ? `$${formData.pricePaid}` : "Not provided"}</div>

                    {formData.bookingId && (
                      <>
                        <div className="text-gray-500">Booking ID:</div>
                        <div className="font-medium">{formData.bookingId}</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="text-sm text-green-800">
                    We'll start tracking this booking and notify you if we find a price drop. You can always view your
                    tracked bookings in your dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={prevStep} className="rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : (
              <div></div> // Empty div to maintain flex spacing
            )}

            {currentStep < totalSteps ? (
              <Button onClick={nextStep} className="rounded-full">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="rounded-full">
                Start Tracking
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative rounded-3xl overflow-hidden inset-0 z-10 bg-gradient-to-r from-black/30 to-transparent">
              <div className="absolute "></div>
              <Image
                src="/hotel/Lindos-Grand-Resort-pool_bu.jpg?height=600&width=1000"
                alt="Luxury hotel room"
                width={1000}
                height={1000}
                className="w-full object-cover"
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
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm h-full">
                <div className="p-6 flex flex-col h-full">
                  <h2 className="text-2xl font-semibold mb-4">Dashboard Summary</h2>
                  <div className="space-y-4 flex-grow">
                    <div className="border rounded-xl p-4">
                      <h3 className="font-medium">Active Trackers</h3>
                      <p className="text-2xl font-semibold">3</p>
                    </div>
                    <div className="border rounded-xl p-4 bg-green-50 border-green-100">
                      <h3 className="font-medium text-green-800">Price Drops Found</h3>
                      <p className="text-2xl font-semibold text-green-800">1</p>
                    </div>
                    <div className="border rounded-xl p-4">
                      <h3 className="font-medium">Potential Savings</h3>
                      <p className="text-2xl font-semibold">$70</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      resetWizard()
                      setIsDialogOpen(true)
                    }}
                    className="w-full rounded-full mt-4"
                  >
                    Track New Hotel
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="bg-white rounded-full p-1 border">
                <TabsTrigger value="active" className="rounded-full">
                  Active Trackers (3)
                </TabsTrigger>
                <TabsTrigger value="saved" className="rounded-full">
                  Price Drops (1)
                </TabsTrigger>
                <TabsTrigger value="history" className="rounded-full">
                  History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <BookingCard
                    hotel="Marriott Resort & Spa"
                    location="Bali, Indonesia"
                    dates="Aug 27 - Aug 30, 2023"
                    originalPrice={320}
                    currentPrice={320}
                    savings={0}
                    image="/placeholder.svg?height=200&width=400"
                  />

                  <BookingCard
                    hotel="Hilton Garden Inn"
                    location="Tokyo, Japan"
                    dates="Sep 15 - Sep 20, 2023"
                    originalPrice={450}
                    currentPrice={380}
                    savings={70}
                    image="/placeholder.svg?height=200&width=400"
                  />

                  <BookingCard
                    hotel="Yogyakarta Homestay"
                    location="Yogyakarta, Indonesia"
                    dates="Oct 5 - Oct 10, 2023"
                    originalPrice={280}
                    currentPrice={280}
                    savings={0}
                    image="/placeholder.svg?height=200&width=400"
                  />
                </div>
              </TabsContent>
              <TabsContent value="saved" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <BookingCard
                    hotel="Hilton Garden Inn"
                    location="Tokyo, Japan"
                    dates="Sep 15 - Sep 20, 2023"
                    originalPrice={450}
                    currentPrice={380}
                    savings={70}
                    image="/placeholder.svg?height=200&width=400"
                  />
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-6">
                <div className="text-center py-8 text-gray-500">
                  <p>Your booking history will appear here</p>
                </div>
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
