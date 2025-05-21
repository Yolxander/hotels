'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoomListing {
  provider: string;
  roomType: string;
  price: string;
  totalPrice: string;
  cancellationPolicy: string;
  bookingUrl: string;
  hotelName: string;
}

interface HotelInfo {
  description: string;
  checkInTime: string;
  checkOutTime: string;
  address: string;
  phone: string;
  websiteUrl: string;
}

export default function TrackerPage() {
  console.log('=== TrackerPage Component Rendered ===');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RoomListing[]>([]);
  const [hotelInfo, setHotelInfo] = useState<HotelInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scraperType, setScraperType] = useState<'price' | 'info'>('price');
  const [formData, setFormData] = useState({
    hotel_name: "",
    location: "",
    check_in_date: new Date(),
    check_out_date: new Date(),
    room_type: "",
    original_price: "",
    email: ""
  });

  const handleInputChange = (field: string, value: any) => {
    console.log(`=== handleInputChange ===`);
    console.log('Field:', field);
    console.log('New Value:', value);
    console.log('Previous Form Data:', formData);
    
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      console.log('Updated Form Data:', newData);
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('=== handleSubmit START ===');
    console.log('Form Data:', formData);
    console.log('Scraper Type:', scraperType);
    
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    setHotelInfo(null);

    try {
      if (scraperType === 'price') {
        const requestBody = {
          destination: formData.hotel_name,
          checkInDate: formData.check_in_date.toISOString().split('T')[0],
          checkOutDate: formData.check_out_date.toISOString().split('T')[0],
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
        
        const data = await response.json();
        console.log('Raw API Response:', data);

        if (!response.ok) {
          console.error('API response not OK:', response.status, response.statusText);
          throw new Error(data.error || 'Failed to search for hotels');
        }

        if (!data || !data.rawData || data.rawData === '[]') {
          console.log('No results found in API response');
          setError('No room listings found for these dates. This could be because:\n1. The hotel is fully booked\n2. The dates are too far in advance\n3. The hotel is not available on these dates\n\nPlease try different dates or check back later.');
          return;
        }

        // Parse the rawData JSON string
        let parsedResults;
        try {
          parsedResults = JSON.parse(data.rawData);
          console.log('Parsed results:', parsedResults);
        } catch (parseError) {
          console.error('Error parsing rawData:', parseError);
          throw new Error('Invalid response format from server');
        }

        // Transform the data to match our RoomListing interface
        const transformedResults = parsedResults.map((item: any) => ({
          provider: item.provider,
          price: item.price || item.pricePerNight || 'N/A',
          totalPrice: item.totalPrice || item.price || 'N/A',
          cancellationPolicy: item.cancellationPolicy || 'Free cancellation available',
          bookingUrl: item.bookingUrl,
          roomType: item.roomType,
          hotelName: item.hotelName
        }));

        console.log('Transformed results:', transformedResults);
        setResults(transformedResults);
      } else {
        // Hotel info scraper
        console.log('Making API request to /api/hotel-info');
        const response = await fetch('/api/hotel-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            destination: formData.hotel_name
          }),
        });

        console.log('API Response status:', response.status);
        
        const data = await response.json();
        console.log('Hotel Info Response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch hotel information');
        }

        setHotelInfo(data.hotelInfo);
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching for hotels. Please try again.');
    } finally {
      console.log('=== handleSubmit END ===');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Hotel Tracker</h1>
      
      <div className="mb-6">
        <Label htmlFor="scraper-type">Scraper Type</Label>
        <Select
          value={scraperType}
          onValueChange={(value: 'price' | 'info') => {
            console.log('Scraper type changed to:', value);
            setScraperType(value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select scraper type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price Scraper</SelectItem>
            <SelectItem value="info">Hotel Info Scraper</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="hotel-name">Hotel Name*</Label>
            <Input
              id="hotel-name"
              placeholder="e.g. Hilton Garden Inn"
              value={formData.hotel_name}
              onChange={(e) => handleInputChange("hotel_name", e.target.value)}
              disabled={loading}
            />
          </div>

          {scraperType === 'price' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="location">Location*</Label>
                <Input
                  id="location"
                  placeholder="e.g. Tokyo, Japan"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="check-in-date">Check-in Date*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left" disabled={loading}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.check_in_date ? format(formData.check_in_date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.check_in_date}
                        onSelect={(date) => {
                          console.log('Check-in date selected:', date);
                          handleInputChange("check_in_date", date);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="check-out-date">Check-out Date*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left" disabled={loading}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.check_out_date ? format(formData.check_out_date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.check_out_date}
                        onSelect={(date) => {
                          console.log('Check-out date selected:', date);
                          handleInputChange("check_out_date", date);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="room-type">Room Type*</Label>
                <Input
                  id="room-type"
                  placeholder="e.g. Standard Double, Deluxe Suite"
                  value={formData.room_type}
                  onChange={(e) => handleInputChange("room_type", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="original-price">Original Price*</Label>
                <Input
                  id="original-price"
                  placeholder="e.g. 320"
                  type="number"
                  value={formData.original_price}
                  onChange={(e) => handleInputChange("original_price", e.target.value)}
                  disabled={loading}
                />
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email for Alerts</Label>
            <Input
              id="email"
              placeholder="your@email.com"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {scraperType === 'price' ? 'Searching...' : 'Fetching Info...'}
            </>
          ) : (
            scraperType === 'price' ? 'Search Hotel' : 'Get Hotel Info'
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="mt-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2 text-gray-600">
            {scraperType === 'price' ? 'Searching for hotels...' : 'Fetching hotel information...'}
          </p>
        </div>
      )}

      {!loading && hotelInfo && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Hotel Information</h2>
          <Card>
            <CardHeader>
              <CardTitle>{formData.hotel_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hotelInfo.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{hotelInfo.description}</p>
                </div>
              )}
              
              {(hotelInfo.checkInTime || hotelInfo.checkOutTime) && (
                <div>
                  <h3 className="font-semibold mb-2">Check-in/Check-out Times</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {hotelInfo.checkInTime && (
                      <div>
                        <p className="text-sm text-gray-500">Check-in</p>
                        <p>{hotelInfo.checkInTime}</p>
                      </div>
                    )}
                    {hotelInfo.checkOutTime && (
                      <div>
                        <p className="text-sm text-gray-500">Check-out</p>
                        <p>{hotelInfo.checkOutTime}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(hotelInfo.address || hotelInfo.phone) && (
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  {hotelInfo.address && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p>{hotelInfo.address}</p>
                    </div>
                  )}
                  {hotelInfo.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{hotelInfo.phone}</p>
                    </div>
                  )}
                </div>
              )}

              {hotelInfo.websiteUrl && (
                <div>
                  <h3 className="font-semibold mb-2">Website</h3>
                  <a 
                    href={hotelInfo.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Hotel Website
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && (results?.length > 0 || hotelInfo) && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          
          {scraperType === 'price' && results && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((listing, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {listing.roomType || 'Room'}
                    </CardTitle>
                    <CardDescription>
                      {listing.hotelName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-green-600">
                        ${listing.price}
                      </p>
                      <p className="text-sm text-gray-500">
                        {listing.bookingUrl ? (
                          <a 
                            href={listing.bookingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            onClick={() => console.log('Opening booking URL:', listing.bookingUrl)}
                          >
                            View on Booking.com
                          </a>
                        ) : (
                          'Booking URL not available'
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {scraperType === 'info' && hotelInfo && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Hotel Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotelInfo.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line">{hotelInfo.description}</p>
                  </div>
                )}
                
                {(hotelInfo.checkInTime || hotelInfo.checkOutTime) && (
                  <div>
                    <h3 className="font-semibold mb-2">Check-in/Check-out Times</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {hotelInfo.checkInTime && (
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <p>{hotelInfo.checkInTime}</p>
                        </div>
                      )}
                      {hotelInfo.checkOutTime && (
                        <div>
                          <p className="text-sm text-gray-500">Check-out</p>
                          <p>{hotelInfo.checkOutTime}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(hotelInfo.address || hotelInfo.phone) && (
                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    {hotelInfo.address && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-500">Address</p>
                        <p>{hotelInfo.address}</p>
                      </div>
                    )}
                    {hotelInfo.phone && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p>{hotelInfo.phone}</p>
                      </div>
                    )}
                  </div>
                )}

                {hotelInfo.websiteUrl && (
                  <div>
                    <h3 className="font-semibold mb-2">Website</h3>
                    <a 
                      href={hotelInfo.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Hotel Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
} 