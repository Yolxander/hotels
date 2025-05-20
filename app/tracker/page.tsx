'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface RoomListing {
  provider: string;
  price: string;
  totalPrice: string;
  cancellationPolicy: string;
  bookingUrl: string;
}

export default function TrackerPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RoomListing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState("Casa de Campo Resort and Villas, La Romana, La Romana, Dominican Republic");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch('/api/hotel-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination,
          checkInDate: "May 20",
          checkOutDate: "May 27"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search for hotels');
      }

      if (data.results.length === 0) {
        setError('No results found for this destination. Please try a different hotel or location.');
        return;
      }

      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching for hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Hotel Tracker</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Destination</label>
            <Input 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter hotel or destination"
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Check-in Date</label>
            <Input 
              value="May 20, 2025"
              readOnly
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Check-out Date</label>
            <Input 
              value="May 27, 2025"
              readOnly
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Travelers</label>
            <Input 
              value="2 travellers, 1 room"
              readOnly
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
          {results.map((listing, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{listing.provider}</h3>
                  <p className="text-sm text-gray-600">{listing.cancellationPolicy}</p>
                  <p className="text-lg font-bold mt-2">{listing.totalPrice}</p>
                </div>
                <a
                  href={listing.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Book Now
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 