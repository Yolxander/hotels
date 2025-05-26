"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
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
  Loader2,
  ChevronRight,
  ChevronLeft,
  Search,
  Plus,
  Trash2,
  AlertCircle,
  XCircle,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays, isAfter, isBefore, differenceInDays } from "date-fns"
import { Header } from "@/components/header"
import { BookingList } from '@/components/bookings/booking-list'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Booking } from '@/app/types/booking'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchUserBookings, createBooking, saveRoomListings, fetchRoomListings } from '../actions/booking-actions'
import { fetchHotelImages, fetchHotelPrices, processHotelPrices } from '../actions/hotel-actions'

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRebookModalOpen, setIsRebookModalOpen] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingStep, setLoadingStep] = useState<'idle' | 'setting-up' | 'finalizing' | 'completed'>('idle')
  const [scrapingResults, setScrapingResults] = useState<any[]>([])
  const [scrapingError, setScrapingError] = useState<string | null>(null)
  const [scrapingLoading, setScrapingLoading] = useState(false)
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    hotel_name: "",
    location: "",
    check_in_date: undefined as Date | undefined,
    check_out_date: undefined as Date | undefined,
    original_price: "",
    room_type: "",
  })

  const fetchBookings = async () => {
    if (!user) return
    try {
      const bookings = await fetchUserBookings(user.id);
      setBookings(bookings as any); // Type assertion needed due to different Booking types
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

  const findRoomListings = async (formData: any) => {
    console.log('=== findRoomListings START ===');
    console.log('Input formData:', formData);
    
    try {
      setScrapingLoading(true);
      setScrapingError(null);
      setScrapingResults([]);

      const requestBody = {
        destination: formData.hotel_name,
        checkInDate: format(formData.check_in_date, 'yyyy-MM-dd'),
        checkOutDate: format(formData.check_out_date, 'yyyy-MM-dd'),
        originalPrice: parseFloat(formData.original_price)
      };

      console.log('Making API request to /api/scrape with params:', requestBody);

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        throw new Error('Failed to fetch hotel prices');
      }

      const data = await response.json();
      console.log('Raw API Response:', data);

      if (!data || !data.rawData) {
        console.error('Invalid API response format:', data);
        throw new Error('Invalid response format from scraper');
      }

      // Check if the response is an empty array
      if (data.rawData === '[]') {
        console.log('Scraper returned empty results');
        setScrapingError('No room listings found for these dates. This could be because:\n1. The hotel is fully booked\n2. The dates are too far in advance\n3. The hotel is not available on these dates\n\nPlease try different dates or check back later.');
        return [];
      }

      // Extract the JSON array from the raw data
      const jsonMatch = data.rawData.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('No JSON array found in raw data:', data.rawData);
        throw new Error('No valid data found in scraper response');
      }

      console.log('Found JSON array in raw data, length:', jsonMatch[0].length);
      console.log('First 100 characters of JSON array:', jsonMatch[0].substring(0, 100));

      // Split the array into individual items and filter out truncated ones
      const items = jsonMatch[0]
        .slice(1, -1) // Remove the outer []
        .split('},')
        .map((item: string) => item.trim())
        .filter((item: string) => {
          // Check if the item has all required fields and is properly formatted
          const hasRequiredFields = 
            item.includes('"provider"') &&
            item.includes('"roomType"') &&
            item.includes('"features"') &&
            item.includes('"basePrice"') &&
            item.includes('"totalPrice"') &&
            item.includes('"bookingUrl"');
          
          // Check if the item ends with a closing brace or has a proper structure
          const hasProperEnding = item.endsWith('}') || item.includes('"bookingUrl"');
          
          const isValid = hasRequiredFields && hasProperEnding;
          
          if (!isValid) {
            console.log('Filtered out invalid item:', item);
          }
          return isValid;
        })
        .map((item: string) => {
          // Add back the closing brace if it's missing
          return item.endsWith('}') ? item : item + '}';
        });

      console.log(`Found ${items.length} valid room listings`);

      if (items.length === 0) {
        console.log('No valid items found after filtering');
        setScrapingError('No valid room listings found. This could be because:\n1. The hotel is fully booked\n2. The dates are too far in advance\n3. The hotel is not available on these dates\n\nPlease try different dates or check back later.');
        return [];
      }

      // Reconstruct the JSON array
      const validJsonArray = '[' + items.join(',') + ']';
      console.log('Reconstructed JSON array length:', validJsonArray.length);

      try {
        // Parse the JSON data
        const results = JSON.parse(validJsonArray);
        console.log('Successfully parsed JSON, found', results.length, 'results');

        // Clean up the results
        const cleanedResults = results
          .map((result: any) => {
            try {
              // Extract numeric value from price string (remove $ and commas)
              const basePrice = parseFloat(result.basePrice.replace(/[$,]/g, ''));
              const totalPrice = parseFloat(result.totalPrice.replace(/[$,]/g, ''));
              
              // Clean up features array
              const cleanFeatures = result.features
                .filter((f: string) => f !== ',' && f !== '·')
                .map((f: string) => f.trim())
                .filter((f: string) => f.length > 0);

              const cleaned = {
                provider: result.provider,
                roomType: result.roomType,
                features: cleanFeatures,
                basePrice: result.basePrice,
                totalPrice: result.totalPrice,
                bookingUrl: result.bookingUrl,
                basePriceValue: basePrice,
                totalPriceValue: totalPrice
              };

              console.log('Cleaned room listing:', cleaned);
              return cleaned;
            } catch (error) {
              console.error('Error cleaning room listing:', error, result);
              return null;
            }
          })
          .filter((result: any) => result !== null)
          .filter((result: any) => {
            const originalPrice = parseFloat(formData.original_price);
            const isCheaper = result.totalPriceValue < originalPrice;
            if (!isCheaper) {
              console.log(`Filtered out expensive room: ${result.roomType} ($${result.totalPriceValue} > $${originalPrice})`);
            }
            return isCheaper;
          })
          .sort((a: any, b: any) => {
            return a.totalPriceValue - b.totalPriceValue;
          });

        console.log(`Found ${cleanedResults.length} rooms cheaper than original price of $${formData.original_price}`);

        if (cleanedResults.length === 0) {
          console.log('No cheaper rooms found, setting error message');
          setScrapingError('No rooms found that are cheaper than your original booking. Please check back later for better deals.');
          return [];
        }

        // Save results to local storage
        const cacheKey = `room_listings_${formData.hotel_name}_${format(formData.check_in_date, 'yyyy-MM-dd')}_${format(formData.check_out_date, 'yyyy-MM-dd')}`;
        localStorage.setItem(cacheKey, JSON.stringify(cleanedResults));

        console.log('Saved results to local storage with key:', cacheKey);
        console.log('Final cleaned results:', cleanedResults);

        setScrapingResults(cleanedResults);
        return cleanedResults;
      } catch (error) {
        console.error('Error parsing or processing JSON:', error);
        throw new Error('Failed to process room listings data');
      }
    } catch (error) {
      console.error('Error in findRoomListings:', error);
      setScrapingError(error instanceof Error ? error.message : 'Failed to fetch hotel prices');
      return [];
    } finally {
      setScrapingLoading(false);
      console.log('=== findRoomListings END ===');
    }
  };

  const handleSubmit = async () => {
    console.log('=== handleSubmit START ===');
    console.log('Form data:', formData);
    
    if (!user) {
      console.log('No user found, returning');
      alert('You must be logged in to track a booking')
      return
    }

    // Validate required fields
    if (!formData.hotel_name || !formData.location || !formData.check_in_date || !formData.check_out_date || !formData.original_price || !formData.room_type) {
      console.log('Missing required fields:', {
        hotel_name: !formData.hotel_name,
        location: !formData.location,
        check_in_date: !formData.check_in_date,
        check_out_date: !formData.check_out_date,
        original_price: !formData.original_price,
        room_type: !formData.room_type
      });
      alert('Please fill in all required fields')
      return
    }

    setLoadingStep('setting-up')
    setScrapingLoading(true)
    setScrapingError(null)

    try {
      // First, fetch hotel images
      console.log('Fetching hotel images...');
      const hotelImages = await fetchHotelImages(formData.hotel_name);
      const imageUrl = hotelImages.length > 0 ? hotelImages[0].url : null;
      console.log('Hotel images fetched:', hotelImages);

      // Create the booking with the first image
      console.log('Creating booking...');
      const bookingData = await createBooking({
        userId: user.id,
        hotelName: formData.hotel_name,
        location: formData.location,
        checkInDate: formData.check_in_date,
        checkOutDate: formData.check_out_date,
        originalPrice: parseFloat(formData.original_price),
        roomType: formData.room_type,
        imageUrl: imageUrl
      });
      console.log('Booking created:', bookingData);

      // Add the new booking to the state immediately
      setBookings(prev => [bookingData, ...prev]);

      // Close the dialog and reset form
      setIsDialogOpen(false);
      setLoadingStep('idle');
      setFormData({
        hotel_name: "",
        location: "",
        check_in_date: undefined,
        check_out_date: undefined,
        original_price: "",
        room_type: "",
      });

      // Show loading indicator in bottom right
      const loadingToast = document.createElement('div');
      loadingToast.className = 'fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50';
      loadingToast.innerHTML = `
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span>Fetching hotel prices...</span>
      `;
      document.body.appendChild(loadingToast);

      // Find room listings
      console.log('Fetching hotel prices...');
      const roomListings = await fetchHotelPrices({
        hotelName: formData.hotel_name,
        location: formData.location,
        checkInDate: formData.check_in_date.toISOString().split('T')[0],
        checkOutDate: formData.check_out_date.toISOString().split('T')[0]
      });
      console.log('Hotel prices fetched:', roomListings);

      // Process the prices with room type and original price
      console.log('Processing hotel prices...');
      const processedPrices = await processHotelPrices(
        roomListings,
        formData.room_type,
        parseFloat(formData.original_price)
      );
      console.log('Processed prices:', processedPrices);

      // Save room listings to the database
      if (processedPrices && processedPrices.length > 0) {
        console.log('Saving room listings...');
        await saveRoomListings(bookingData.id, processedPrices);
      }

      // Remove loading indicator
      document.body.removeChild(loadingToast);

      // Show success message
      const successToast = document.createElement('div');
      successToast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successToast.textContent = 'Successfully tracked hotel prices!';
      document.body.appendChild(successToast);
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 3000);

      // Refresh bookings and update stats
      await fetchBookings();
      
      // Force a re-render of the dashboard summary
      setLoading(prev => !prev);
      setTimeout(() => setLoading(prev => !prev), 100);

    } catch (error) {
      console.error('Error in handleSubmit:', error)
      setScrapingError(error instanceof Error ? error.message : 'An error occurred')
      
      // Show error toast
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorToast.textContent = error instanceof Error ? error.message : 'An error occurred';
      document.body.appendChild(errorToast);
      setTimeout(() => {
        document.body.removeChild(errorToast);
      }, 3000);
    } finally {
      setLoadingStep('idle')
      setScrapingLoading(false)
      console.log('=== handleSubmit END ===');
    }
  }

  const handleRebookNow = async (booking: Booking) => {
    try {
      setScrapingLoading(true);
      setScrapingError(null);
      setScrapingResults([]);

      // Fetch room listings
      const roomListings = await fetchRoomListings(booking.id);

      if (!roomListings || roomListings.length === 0) {
        setScrapingError('No room listings found for this booking. Please try again later.');
        return;
      }

      // If there's only one room listing, redirect directly to the booking URL
      if (roomListings.length === 1) {
        window.open(roomListings[0].booking_url, '_blank');
        return;
      }

      // Otherwise, show the modal with multiple options
      setIsRebookModalOpen(true);

      // Format the listings for display
      const formattedListings = roomListings.map((listing: any) => ({
        provider: listing.provider,
        roomType: listing.room_type,
        features: listing.features,
        basePrice: `$${listing.base_price}`,
        totalPrice: `$${listing.total_price}`,
        bookingUrl: listing.booking_url,
        basePriceValue: listing.base_price,
        totalPriceValue: listing.total_price
      }));

      setScrapingResults(formattedListings);
    } catch (error) {
      console.error('Error fetching room listings:', error);
      setScrapingError(error instanceof Error ? error.message : 'Failed to fetch room listings');
    } finally {
      setScrapingLoading(false);
    }
  };

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
              room_type: "",
            })
            setLoadingStep('idle')
          }
        }}
      >
        <DialogContent className={`sm:max-w-[600px] ${loadingStep !== 'idle' ? 'bg-white' : ''}`}>
          {loadingStep === 'idle' ? (
            <>
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

                  <div className="grid gap-2">
                    <Label htmlFor="room-type">Room Type*</Label>
                    <Input
                      id="room-type"
                      placeholder="e.g. Standard Room"
                      value={formData.room_type}
                      onChange={(e) => handleInputChange("room_type", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Saving...' : 'Start Tracking'}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              {loadingStep === 'setting-up' && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300 mb-4"></div>
                  <p className="text-lg font-medium">Setting up...</p>
                </div>
              )}
              {loadingStep === 'finalizing' && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300 mb-4"></div>
                  <p className="text-lg font-medium">Finalizing...</p>
                </div>
              )}
              {loadingStep === 'completed' && (
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 text-yellow-300 mb-4" />
                  <p className="text-lg font-medium">Finalized!</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isRebookModalOpen} onOpenChange={setIsRebookModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light">
              Your <span className="italic font-normal text-yellow-300">Deals</span>
            </DialogTitle>
            <DialogDescription className="text-gray-500">Here are the best available prices for your dates</DialogDescription>
          </DialogHeader>

          {scrapingLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-yellow-300" />
              <p>Searching for the best deals...</p>
            </div>
          ) : scrapingError ? (
            <Alert variant="destructive">
              <AlertDescription>{scrapingError}</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scrapingResults.slice(0, 5).map((result, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-gray-200"
                  onClick={() => window.open(result.bookingUrl, '_blank')}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {result.roomType}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {result.provider}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-black underline decoration-4 decoration-yellow-300">
                          {result.totalPrice}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.basePrice} base
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      {result.features.map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      className="w-full bg-black hover:bg-gray-900 text-yellow-300 border border-yellow-300/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(result.bookingUrl, '_blank');
                      }}
                    >
                      Book Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
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
                  Your <span className="italic font-normal text-yellow-300">Savings</span>
                  <br />
                  Dashboard
                </h1>
              </div>
            </div>

            <div className="lg:col-span-1">
              <DashboardSummary onTrackNewHotel={() => setIsDialogOpen(true)} />
            </div>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="regular" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="regular">Regular Bookings</TabsTrigger>
                <TabsTrigger value="discovered">Discovered Hotels</TabsTrigger>
              </TabsList>
              
              <TabsContent value="regular">
                <BookingList 
                  bookings={bookings.filter(booking => !booking.is_discovered)} 
                  loading={loading}
                  onRebookNow={handleRebookNow}
                  onTrackingUpdate={fetchBookings}
                />
              </TabsContent>

              <TabsContent value="discovered">
                <BookingList 
                  bookings={bookings.filter(booking => booking.is_discovered)} 
                  loading={loading}
                  onRebookNow={handleRebookNow}
                  onTrackingUpdate={fetchBookings}
                />
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
  hasRoomListings: boolean
}

function BookingCard({ hotel, location, dates, originalPrice, currentPrice, savings, image, hasRoomListings }: BookingCardProps) {
  const hasSavings = savings > 0
  const [isLoadingListings, setIsLoadingListings] = useState(false)

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
              <div className={`font-semibold ${hasSavings ? "text-green-600" : ""}`}>
                ${currentPrice}
                {hasSavings && <span className="text-xs ml-1">(lowest available)</span>}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Savings</div>
              <div className={`font-semibold ${hasSavings ? "text-green-600" : ""}`}>
                ${savings}
                {hasSavings && <span className="text-xs ml-1">({Math.round((savings / originalPrice) * 100)}%)</span>}
              </div>
            </div>
          </div>
        </div>

        {hasSavings ? (
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <p className="text-sm text-green-800">
              Good news! The price for your hotel dropped from ${originalPrice} to ${currentPrice}. You may want to
              rebook and save!
            </p>
          </div>
        ) : isLoadingListings ? (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
              <p className="text-sm text-yellow-800">
                We're searching for the best prices for your booking. Feel free to keep navigating while we find the best deals!
              </p>
            </div>
          </div>
        ) : !hasRoomListings ? (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              No cheaper rooms found at the moment. Set up a tracker to monitor price drops and get notified when better deals become available.
            </p>
          </div>
        ) : null}
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
        ) : !hasRoomListings ? (
          <Button 
            size="sm" 
            className="rounded-full bg-blue-500 hover:bg-blue-600"
            onClick={() => setIsLoadingListings(true)}
          >
            <Bell className="h-4 w-4 mr-2" />
            Set Up Tracker
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
