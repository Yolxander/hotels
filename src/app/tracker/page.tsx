'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrackerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/scrape', {
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
      setResult(data.url);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search Hotel'}
            </Button>
          </form>

          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Search Results:</h3>
              <a 
                href={result} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Hotel Details
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 