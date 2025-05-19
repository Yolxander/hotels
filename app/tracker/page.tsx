'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import Image from 'next/image';
import { Star } from 'lucide-react';

export default function TrackerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Sending request to /api/agentql...');
      const response = await fetch('/api/agentql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: 'Casa de Campo Resort and Villas, La Romana, La Romana, Dominican Republic',
          checkIn: '2025-05-20',
          checkOut: '2025-05-27',
          travelers: '2 travellers, 1 room'
        }),
      });
      
      const data = await response.json();
      console.log('Received response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch hotel information');
      }
      
      setResult(data);
    } catch (error) {
      console.error('Error in frontend:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Hotel Price Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Destination</label>
                  <Input 
                    value="Casa de Campo Resort and Villas, La Romana, La Romana, Dominican Republic"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Check-in Date</label>
                  <Input 
                    value="May 20, 2025"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Check-out Date</label>
                  <Input 
                    value="May 27, 2025"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Travelers</label>
                  <Input 
                    value="2 travellers, 1 room"
                    readOnly
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Searching...' : 'Search Hotel'}
              </Button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Search Results:</h3>
                <div className="grid gap-6">
                  {result.hotels?.map((hotel: any) => (
                    <div key={hotel.id} className="border rounded-lg overflow-hidden bg-white">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative h-48 md:h-full">
                          {hotel.image_url ? (
                            <Image
                              src={hotel.image_url}
                              alt={hotel.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">No image available</span>
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-lg">{hotel.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{hotel.location}</p>
                            </div>
                            {hotel.rating && (
                              <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 flex justify-between items-end">
                            <div>
                              <span className="text-2xl font-bold">${hotel.price}</span>
                              <span className="text-sm text-gray-500"> per night</span>
                            </div>
                            <a 
                              href={hotel.booking_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            >
                              Book Now
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 