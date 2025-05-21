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
import Image from 'next/image';

interface BaseRoomListing {
  name: string;
  price: string;
  url: string;
}

interface PriceRoomListing extends BaseRoomListing {
  provider: string;
  roomType: string;
  features: string[];
  basePrice: string;
  totalPrice: string;
  cancellationPolicy?: string;
}

interface DealRoomListing extends BaseRoomListing {
  rating: string;
  reviews: string;
  deal: string;
  image: string;
  location: string;
  amenities: string[];
  description: string;
}

type RoomListing = PriceRoomListing | DealRoomListing;

interface HotelInfo {
  description: string;
  checkInTime: string;
  checkOutTime: string;
  address: string;
  phone: string;
  websiteUrl: string;
}

interface HotelImage {
  url: string;
  alt: string;
  caption: string;
}

export default function TrackerPage() {
  console.log('=== TrackerPage Component Rendered ===');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RoomListing[]>([]);
  const [hotelInfo, setHotelInfo] = useState<HotelInfo | null>(null);
  const [hotelImages, setHotelImages] = useState<HotelImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scraperType, setScraperType] = useState<'price' | 'info' | 'images' | 'deals'>('price');
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
    setHotelImages([]);

    try {
      if (scraperType === 'deals') {
        const response = await fetch('/api/hotel-deals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            destination: formData.location,
            checkIn: formData.check_in_date.toISOString().split('T')[0],
            checkOut: formData.check_out_date.toISOString().split('T')[0],
            travelers: formData.room_type
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch hotel deals');
        }

        setResults(data.hotelSuggestions.map((deal: any) => ({
          name: deal.name,
          price: deal.price,
          rating: deal.rating,
          reviews: deal.reviews,
          deal: deal.deal,
          url: deal.url,
          image: deal.image,
          location: deal.location,
          amenities: deal.amenities,
          description: deal.description
        })));
      } else if (scraperType === 'price') {
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
          provider: item.provider || 'Unknown Provider',
          roomType: item.roomType || 'Room',
          features: Array.isArray(item.features) ? item.features.filter((f: string) => f && f !== ',') : [],
          basePrice: item.basePrice || 'N/A',
          totalPrice: item.totalPrice || 'N/A',
          url: item.bookingUrl || '',
          name: item.roomType || 'Room',
          price: item.totalPrice || 'N/A'
        }));

        console.log('Transformed results:', transformedResults);
        setResults(transformedResults);
      } else if (scraperType === 'info') {
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
      } else if (scraperType === 'images') {
        console.log('Making API request to /api/hotel-images');
        const response = await fetch('/api/hotel-images', {
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
        console.log('Hotel Images Response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch hotel images');
        }

        setHotelImages(data.hotelImages);
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
          onValueChange={(value: 'price' | 'info' | 'images' | 'deals') => {
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
            <SelectItem value="images">Hotel Images Scraper</SelectItem>
            <SelectItem value="deals">Hotel Deals Scraper</SelectItem>
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

          {scraperType === 'price' || scraperType === 'deals' ? (
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

              {scraperType === 'price' && (
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
              )}
            </>
          ) : null}

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
              {scraperType === 'price' ? 'Searching...' : scraperType === 'info' ? 'Fetching Info...' : scraperType === 'images' ? 'Fetching Images...' : 'Fetching Deals...'}
            </>
          ) : (
            scraperType === 'price' ? 'Search Hotel' : scraperType === 'info' ? 'Get Hotel Info' : scraperType === 'images' ? 'Get Hotel Images' : 'Get Hotel Deals'
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
            {scraperType === 'price' ? 'Searching for hotels...' : scraperType === 'info' ? 'Fetching hotel information...' : scraperType === 'images' ? 'Fetching hotel images...' : 'Fetching hotel deals...'}
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

      {!loading && (results?.length > 0 || hotelInfo || hotelImages?.length > 0) && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          
          {scraperType === 'price' && results && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((listing, index) => {
                const priceListing = listing as PriceRoomListing;
                return (
                  <Card key={index} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {priceListing.roomType}
                      </CardTitle>
                      <CardDescription className="text-blue-600">
                        {priceListing.provider}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-green-600">
                            {priceListing.totalPrice}
                          </p>
                          {priceListing.basePrice !== priceListing.totalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              {priceListing.basePrice}
                            </p>
                          )}
                        </div>
                        {priceListing.features && priceListing.features.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2">
                              {priceListing.features.map((feature, i) => (
                                <span
                                  key={i}
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {priceListing.url && (
                          <a 
                            href={priceListing.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline block mt-4"
                          >
                            Book on {priceListing.provider}
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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

          {scraperType === 'images' && hotelImages && hotelImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotelImages.map((image, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative aspect-video w-full">
                    <div className="absolute inset-0">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        unoptimized
                        priority={index === 0}
                      />
                    </div>
                  </div>
                  {image.caption && (
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">{image.caption}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}

          {scraperType === 'deals' && results && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((listing, index) => {
                const dealListing = listing as DealRoomListing;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {dealListing.image && (
                      <div className="relative h-48 w-full">
                        <img
                          src={dealListing.image}
                          alt={dealListing.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{dealListing.name}</h3>
                      {dealListing.location && (
                        <p className="text-gray-600 text-sm mb-2">
                          <i className="fas fa-map-marker-alt mr-2"></i>
                          {dealListing.location}
                        </p>
                      )}
                      <div className="flex items-center mb-2">
                        {dealListing.rating && (
                          <span className="text-yellow-500 mr-2">
                            <i className="fas fa-star"></i> {dealListing.rating}
                          </span>
                        )}
                        {dealListing.reviews && (
                          <span className="text-gray-600 text-sm">
                            ({dealListing.reviews} reviews)
                          </span>
                        )}
                      </div>
                      {dealListing.price && (
                        <p className="text-xl font-bold text-green-600 mb-2">
                          {dealListing.price}
                        </p>
                      )}
                      {dealListing.deal && (
                        <p className="text-red-600 font-semibold mb-2">
                          <i className="fas fa-tag mr-2"></i>
                          {dealListing.deal}
                        </p>
                      )}
                      {dealListing.amenities && dealListing.amenities.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600 mb-1">Amenities:</p>
                          <div className="flex flex-wrap gap-2">
                            {dealListing.amenities.map((amenity, i) => (
                              <span
                                key={i}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {dealListing.description && (
                        <p className="text-gray-600 text-sm mb-4">{dealListing.description}</p>
                      )}
                      <a
                        href={dealListing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        View Deal
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 