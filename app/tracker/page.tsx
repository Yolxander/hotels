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

interface RoomListing {
  provider: string;
  price: string;
  totalPrice: string;
  cancellationPolicy: string;
  bookingUrl: string;
  roomType?: string;
}

export default function TrackerPage() {
  console.log('=== TrackerPage Component Rendered ===');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RoomListing[]>([]);
  const [error, setError] = useState<string | null>(null);
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
    
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    try {
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
        roomType: item.roomType
      }));

      console.log('Transformed results:', transformedResults);
      setResults(transformedResults);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching for hotels. Please try again.');
    } finally {
      console.log('=== handleSubmit END ===');
      setLoading(false);
    }
  };

  // Log state changes
  console.log('Current State:', {
    loading,
    resultsCount: results.length,
    error,
    formData
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Hotel Price Tracker</h1>
      
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
              Searching...
            </>
          ) : (
            'Search Hotel'
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
          <p className="mt-2 text-gray-600">Searching for hotels...</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Available Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((listing, index) => {
              console.log(`Rendering listing ${index}:`, listing);
              return (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg">{listing.provider}</CardTitle>
                    <CardDescription>
                      {listing.roomType && <div className="mb-1">{listing.roomType}</div>}
                      {listing.cancellationPolicy}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{listing.totalPrice}</div>
                    {listing.price !== listing.totalPrice && (
                      <div className="text-sm text-gray-500">Per night: {listing.price}</div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-black hover:bg-gray-900 text-yellow-300 border border-yellow-300/20"
                      onClick={() => {
                        console.log('Opening booking URL:', listing.bookingUrl);
                        window.open(listing.bookingUrl, '_blank');
                      }}
                    >
                      Book Now
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 