'use client';

import { useState, useEffect } from 'react';
import Image from "next/image"
import { Header } from "@/components/header"
import Footer from '../components/Footer'
import ScrollToSearch from '../components/ScrollToSearch'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: string;
  reviews: string;
  image: string;
  price: string;
  deal: string;
  url: string;
}

interface SearchFormData {
  location: string;
  travelers: string;
  checkIn: string;
  checkOut: string;
}

const LoadingScreen = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    "Collecting your trip data...",
    "Searching database and external sources...",
    "Analyzing best deals and discounts...",
    "Preparing your personalized results..."
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center mb-6">Finding the Best Deals for You</h3>
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                index < currentStep ? 'bg-green-500' : 
                index === currentStep ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'
              }`}>
                {index < currentStep ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-white text-sm">{index + 1}</span>
                )}
              </div>
              <span className={`${
                index === currentStep ? 'text-blue-500 font-medium' : 
                index < currentStep ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function TopHotels() {
  const [topHotels, setTopHotels] = useState<Hotel[]>([]);
  const [remainingHotels, setRemainingHotels] = useState<Hotel[]>([]);
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isCustomSearch, setIsCustomSearch] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState<SearchFormData>({
    location: '',
    travelers: '2',
    checkIn: '',
    checkOut: ''
  });

  const fetchHotels = async () => {
    try {
      console.log('=== fetchHotels START ===');
      const response = await fetch('/api/top-hotels');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch hotels');
      }

      console.log('fetchHotels data:', data);

      // Create a Set of hotel names to track uniqueness
      const uniqueHotels = new Set();
      const uniqueTopHotels = data.topHotels.filter((hotel: Hotel) => {
        if (uniqueHotels.has(hotel.name)) {
          return false;
        }
        uniqueHotels.add(hotel.name);
        return true;
      });

      // If we don't have 3 unique top hotels, fill from remaining hotels
      let finalTopHotels = [...uniqueTopHotels];
      if (finalTopHotels.length < 3) {
        const remainingUniqueHotels = data.remainingHotels.filter((hotel: Hotel) => {
          if (uniqueHotels.has(hotel.name)) {
            return false;
          }
          uniqueHotels.add(hotel.name);
          return true;
        });
        finalTopHotels = [...finalTopHotels, ...remainingUniqueHotels].slice(0, 3);
      }

      // Update remaining hotels to exclude the ones we used in top hotels
      const remainingHotels = data.remainingHotels.filter((hotel: Hotel) => 
        !finalTopHotels.some(topHotel => topHotel.name === hotel.name)
      );

      console.log('Setting final top hotels:', finalTopHotels);
      setTopHotels(finalTopHotels);
      setRemainingHotels(remainingHotels);
      setDestination(data.destination);
      console.log('=== fetchHotels END ===');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('=== useEffect START ===');
    fetchHotels();
    console.log('=== useEffect END ===');
  }, []);

  const handleReset = () => {
    // Reset form data
    setFormData({
      location: '',
      travelers: '2',
      checkIn: '',
      checkOut: ''
    });
    
    // Clear local storage
    localStorage.removeItem('hotelDeals');
    
    // Reset to daily deals
    setIsCustomSearch(false);
    
    // Fetch original daily deals
    fetchHotels();
  };

  const handleHotelClick = (url: string) => {
    if (url) {
      window.open(`https://www.google.com${url}`, '_blank');
    }
  };

  const handleMarkAsDiscovered = async (hotel: Hotel) => {
    try {
      // Get current date and add 7 days for checkout
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      // Format dates as YYYY-MM-DD
      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };

      // First fetch hotel image
      const imageResponse = await fetch('/api/hotel-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: hotel.name
        }),
      });

      let imageUrl = '/placeholder.svg?height=200&width=400';
      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        if (imageData.hotelImages && imageData.hotelImages.length > 0) {
          imageUrl = imageData.hotelImages[0].url;
        }
      }

      // Save the booking to the database
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user?.id,
            hotel_name: hotel.name,
            location: hotel.location,
            check_in_date: formatDate(today),
            check_out_date: formatDate(nextWeek),
            original_price: parseFloat(hotel.price.replace(/[^0-9.]/g, '')),
            current_price: parseFloat(hotel.price.replace(/[^0-9.]/g, '')),
            savings: 0,
            room_type: 'Standard Room',
            image_url: imageUrl,
            is_discovered: true
          }
        ])
        .select()
        .single();

      if (bookingError) {
        throw bookingError;
      }

      // Show success message
      alert('Hotel marked as discovered and saved to your bookings!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark hotel as discovered');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const simulateLoadingSteps = async () => {
    for (let i = 0; i < 4; i++) {
      setLoadingStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 seconds per step
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== handleSearch START ===');
    
    if (!formData.location) {
      setError('Please enter a location');
      return;
    }

    setSearchLoading(true);
    setLoadingStep(0);
    setError(null);

    try {
      // Start the loading animation
      simulateLoadingSteps();

      const response = await fetch('/api/hotel-deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: formData.location,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          travelers: formData.travelers
        }),
      });

      const data = await response.json();
      console.log('handleSearch data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch hotel deals');
      }

      // Update local storage with new deals
      const storedDeals = localStorage.getItem('hotelDeals');
      const currentDeals = storedDeals ? JSON.parse(storedDeals) : [];
      const newDeals = [...currentDeals, ...data.hotelSuggestions];
      localStorage.setItem('hotelDeals', JSON.stringify(newDeals));

      // Update the page with new deals
      if (data.hotelSuggestions.length > 0) {
        // Create a Set of hotel names to track uniqueness
        const uniqueHotels = new Set();
        const uniqueSuggestions = data.hotelSuggestions.filter((hotel: Hotel) => {
          if (uniqueHotels.has(hotel.name)) {
            return false;
          }
          uniqueHotels.add(hotel.name);
          return true;
        });

        console.log('Setting top hotels with unique suggestions:', uniqueSuggestions.slice(0, 3));
        setTopHotels(uniqueSuggestions.slice(0, 3));
        setRemainingHotels(uniqueSuggestions.slice(3));
        setDestination(formData.location);
        setIsCustomSearch(true);
      }
      console.log('=== handleSearch END ===');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hotel deals');
    } finally {
      setSearchLoading(false);
      setLoadingStep(0);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      {searchLoading && <LoadingScreen currentStep={loadingStep} />}
      <main className="bg-[#f9f9f9] px-4">
        {/* Hero Section */}
        <section className="relative w-full h-[650px] md:h-[750px] rounded-3xl overflow-hidden mx-auto mt-6 shadow-lg flex items-end">
          <Image
            src="/hotel/portugal-hotel-luxury.webp"
            alt="Top Hotels Collection"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col md:flex-row items-center md:items-stretch justify-between z-10 w-full px-8 py-10">
            {/* Left: Heading and Subtext */}
            <div className="flex-1 flex flex-col justify-center md:justify-end md:pb-44">
              <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight text-left leading-tight drop-shadow-lg mb-4">
                Find the <span className="text-yellow-300">Hottest </span><br className="hidden md:block" /> Hotels in Your Next Destination
              </h1>
              <p className="text-white text-lg md:text-2xl font-medium text-left max-w-xl mb-6">
                Fill up your trip details and get the best deals on premium accommodations. Your perfect stay is just a search away.
              </p>
            </div>
            {/* Right: Stats */}
            <div className="flex flex-col gap-8 items-end justify-center md:justify-end md:pb-44 min-w-[180px]">
              <div className="text-white text-4xl md:text-5xl font-bold text-right">15k+<div className="text-base font-normal">Premium Hotels</div></div>
              <div className="text-white text-4xl md:text-5xl font-bold text-right">50k+<div className="text-base font-normal">Happy Guests</div></div>
              <div className="text-white text-4xl md:text-5xl font-bold text-right">30%<div className="text-base font-normal">Best Price Guarantee</div></div>
            </div>
          </div>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="absolute left-1/2 -translate-x-1/2 bottom-12 md:bottom-12 w-[95%] md:w-4/5 bg-white rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between px-4 py-6 gap-4 z-20 search-section">
            <div className="grid grid-cols-2 md:flex md:flex-row w-full gap-4">
              {/* Location */}
              <div className="flex flex-col items-start">
                <label className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="10"/>
                    <path d="M11 15v-4"/>
                    <path d="M11 7h.01"/>
                  </svg>
                  Location
                </label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Location" 
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200" 
                  required
                />
              </div>
              {/* Person */}
              <div className="flex flex-col items-start">
                <label className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="7" r="4"/>
                    <path d="M5.5 21a7.5 7.5 0 0 1 11 0"/>
                  </svg>
                  Person
                </label>
                <select 
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                  required
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4+ People</option>
                </select>
              </div>
              {/* Check in */}
              <div className="flex flex-col items-start">
                <label className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="16" height="16" rx="2"/>
                    <path d="M16 2v4"/>
                    <path d="M8 2v4"/>
                    <path d="M3 10h16"/>
                  </svg>
                  Check in
                </label>
                <input 
                  type="date" 
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200" 
                  required
                />
              </div>
              {/* Check out */}
              <div className="flex flex-col items-start">
                <label className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="16" height="16" rx="2"/>
                    <path d="M16 2v4"/>
                    <path d="M8 2v4"/>
                    <path d="M3 10h16"/>
                  </svg>
                  Check out
                </label>
                <input 
                  type="date" 
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200" 
                  required
                />
              </div>
            </div>
            {/* Search Button */}
            <button 
              type="submit"
              disabled={searchLoading}
              className="w-full md:w-auto bg-black text-white font-semibold rounded-xl px-8 py-4 mt-2 md:mt-0 text-lg transition hover:bg-gray-900 disabled:bg-gray-400"
            >
              {searchLoading ? 'Searching...' : isCustomSearch ? 'Update Search' : 'Search'}
            </button>
          </form>
        </section>

        {/* Amazing Hotels Section */}
        <section className="max-w-8xl mx-auto mt-24 mb-16 px-2 md:px-2">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-2">
            {isCustomSearch ? 'Your Customized Hotel Deals' : 'Daily Hotel Deals'}
            <br />
            <span className="text-2xl md:text-3xl text-gray-600">
              {isCustomSearch 
                ? `For ${formData.travelers} travelers in ${destination}`
                : `Featured Destination: ${destination}`
              }
            </span>
          </h2>
          <div className="flex flex-col items-center gap-4 mb-10">
            <p className="text-gray-600 text-lg text-center max-w-2xl">
              {isCustomSearch 
                ? 'These are your personalized hotel suggestions based on your trip preferences. You can modify your search or reset to view our daily featured deals.'
                : 'To get more deals and customize your search, please click on the button below or enter your trip preferences in the search component above.'
              }
            </p>
            <div className="flex flex-col items-center gap-2">
              {isCustomSearch ? (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Reset to Daily Deals
                </button>
              ) : (
                <ScrollToSearch />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Left: Large Card */}
            {topHotels[0] && (
              <div 
                className="relative rounded-3xl overflow-hidden shadow-lg h-[380px] md:h-[540px] flex flex-col justify-end cursor-pointer"
                onClick={() => handleHotelClick(topHotels[0].url)}
              >
                <img 
                  src={topHotels[0].image || '/hotel/placeholder.jpg'} 
                  alt={topHotels[0].name} 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative z-10 p-8">
                  <div className="text-white text-2xl md:text-3xl font-bold mb-1">{topHotels[0].name}</div>
                  <div className="text-gray-200 text-base mb-2">{topHotels[0].location}</div>
                  <div className="flex items-center gap-2 text-yellow-400 mb-1">
                    <span>{'★'.repeat(Math.round(parseFloat(topHotels[0].rating)))}</span>
                    <span className="text-gray-200 text-sm">({topHotels[0].reviews} Reviews)</span>
                  </div>
                  <div className="absolute bottom-8 right-8 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsDiscovered(topHotels[0]);
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                      title="Mark as discovered"
                    >
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <span className="bg-white/20 text-white rounded-full p-2">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            )}
            {/* Right: Two Small Cards Stacked */}
            <div className="flex flex-col gap-6 h-[380px] md:h-[540px]">
              {topHotels.slice(1, 3).map((hotel, index) => (
                <div 
                  key={hotel.id} 
                  className="relative rounded-3xl overflow-hidden shadow-lg flex-1 min-h-[120px] flex flex-col justify-end cursor-pointer"
                  onClick={() => handleHotelClick(hotel.url)}
                >
                  <img 
                    src={hotel.image || '/hotel/placeholder.jpg'} 
                    alt={hotel.name} 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="relative z-10 p-6">
                    <div className="text-white text-xl font-bold mb-1">{hotel.name}</div>
                    <div className="text-gray-200 text-sm mb-1">{hotel.location}</div>
                    <div className="flex items-center gap-2 text-yellow-400 mb-1">
                      <span>{'★'.repeat(Math.round(parseFloat(hotel.rating)))}</span>
                      <span className="text-gray-200 text-xs">({hotel.reviews} Reviews)</span>
                    </div>
                    <div className="absolute bottom-6 right-6 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsDiscovered(hotel);
                        }}
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                        title="Mark as discovered"
                      >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <span className="bg-white/20 text-white rounded-full p-2">
                        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5-Star Hotels Section */}
        <section className="max-w-8xl mx-auto mb-24 px-2 md:px-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6 md:gap-0">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-2 md:mb-0 text-left">Explore our<br />5-Star Hotels</h2>
            </div>
            <div className="flex-1 flex flex-col md:items-end">
              <p className="text-gray-600 text-lg mb-4 md:mb-2 text-left md:text-right">Discover the perfect accommodation for your stay worldwide.</p>
              <div className="relative w-full md:w-[340px]">
                <input type="text" placeholder="Find Hotels" className="w-full rounded-full bg-gray-100 py-3 pl-6 pr-12 text-lg shadow focus:outline-none" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {remainingHotels.map((hotel) => (
              <div 
                key={hotel.id} 
                className="rounded-2xl overflow-hidden shadow bg-white cursor-pointer hover:shadow-lg transition-shadow relative group"
                onClick={() => handleHotelClick(hotel.url)}
              >
                <img 
                  src={hotel.image || '/hotel/placeholder.jpg'} 
                  alt={hotel.name} 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-5">
                  <div className="font-bold text-xl mb-1">{hotel.name}</div>
                  <div className="text-gray-500 text-sm mb-2">{hotel.location}</div>
                  <div className="flex items-center gap-2 text-yellow-500 text-base">
                    <span>{'★'.repeat(Math.round(parseFloat(hotel.rating)))}</span>
                    <span className="text-gray-500 text-sm">({hotel.reviews} Reviews)</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsDiscovered(hotel);
                  }}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 shadow-md transition-all duration-200 hover:scale-110"
                  title="Mark as discovered"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 