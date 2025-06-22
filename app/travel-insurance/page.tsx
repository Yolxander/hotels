"use client";

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Shield, Plane, Heart, Globe, Clock, Users, CheckCircle, Star, MapPin, Phone, Mail } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import Footer from '../components/Footer'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TravelInsurance() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <main className="bg-[#f9f9f9] px-1 md:px-4">
        
        {/* Hero Section */}
        <section className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden mx-auto m-6  mb-16 shadow-lg">
          <Image
            src="/hotel/splurge-hotel-soneva-jani.jpg"
            alt="Travel insurance protection"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
            <h1 className="text-white text-3xl md:text-6xl font-bold tracking-tight text-center leading-tight drop-shadow-lg mb-6">
              <span className="text-yellow-300">Protect Your Trip</span> —<br />
              Easily Add Travel Insurance
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-medium text-center max-w-3xl mb-8 leading-relaxed">
              Delays, cancellations, lost luggage, or medical emergencies — travel is full of surprises. With our trusted insurance partner, you're covered from the moment you book.
            </p>
            <Button 
              className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-10 py-4 rounded-full text-xl shadow-lg flex items-center gap-2 transition"
              onClick={() => setIsQuoteModalOpen(true)}
            >
              <Shield className="h-6 w-6" />
              Get a Quote Instantly
              <ArrowUpRight className="h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-md p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">How It Works on Our Platform</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                No complicated forms. No phone calls. Just peace of mind.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Auto-Fill Travel Info</h4>
                <p className="text-gray-600">We auto-fill your travel info (dates, destination, travelers).</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Compare Options</h4>
                <p className="text-gray-600">You compare coverage options in seconds.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">One-Click Protection</h4>
                <p className="text-gray-600">Add protection with one click — done.</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-50 p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-600">
                  ✅ <strong>Powered by</strong> VisitorCoverage.com
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Coverage Section */}
        <section className="w-full mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Types of Coverage You Can Choose</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              💡 Tip: Even refundable hotel bookings may not cover every situation — insurance fills the gap.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Basic</h3>
              <p className="text-gray-600 mb-4">Covers trip cancellation, lost luggage</p>
              <Button variant="outline" className="w-full">From $15</Button>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-md text-center hover:shadow-lg transition-shadow border-2 border-yellow-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Comprehensive</h3>
              <p className="text-gray-600 mb-4">Adds emergency medical coverage</p>
              <Button className="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900">From $35</Button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Adventure Upgrade</h3>
              <p className="text-gray-600 mb-4">Ideal for outdoor or sports-heavy trips</p>
              <Button variant="outline" className="w-full">From $45</Button>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full mx-auto mb-16">
          <div className="relative rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="/hotel/1_Hotel_ReceptionV2h1281.webp"
              alt="Ready to cover your trip"
              width={1200}
              height={500}
              className="object-cover w-full h-[500px]"
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 text-center">
              <h2 className="text-white text-4xl md:text-6xl font-bold tracking-tight leading-tight drop-shadow-lg mb-6">
                Ready to Cover Your Trip?
              </h2>
              <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mb-8 leading-relaxed">
                You've booked smart. Now protect it even smarter.
              </p>
              <Button 
                className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-12 py-4 rounded-full text-xl shadow-lg flex items-center gap-2 transition"
                onClick={() => setIsCompareModalOpen(true)}
              >
                <Shield className="h-6 w-6" />
                Compare Travel Insurance Plans
                <ArrowUpRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Section */}
      <Footer />

      {/* Compare Plans Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800">Compare Travel Insurance Plans</h3>
              <button 
                onClick={() => setIsCompareModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Plan */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-transparent hover:border-blue-300 transition-all">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">Basic</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-2">$15</div>
                  <p className="text-gray-600">per person</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Trip Cancellation up to $5,000</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Baggage Loss up to $1,000</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Travel Delay up to $500</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">24/7 Assistance</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    setIsCompareModalOpen(false)
                    setIsQuoteModalOpen(true)
                  }}
                >
                  Select Plan
                </Button>
              </div>

              {/* Comprehensive Plan */}
              <div className="bg-white rounded-2xl p-6 border-2 border-yellow-300 relative shadow-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-300 text-gray-900 text-sm font-bold px-4 py-1 rounded-full">MOST POPULAR</span>
                </div>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">Comprehensive</h4>
                  <div className="text-3xl font-bold text-green-600 mb-2">$35</div>
                  <p className="text-gray-600">per person</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Trip Cancellation up to $15,000</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Medical Emergency up to $100,000</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Baggage Loss up to $2,500</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Emergency Evacuation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">24/7 Assistance</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900"
                  onClick={() => {
                    setIsCompareModalOpen(false)
                    setIsQuoteModalOpen(true)
                  }}
                >
                  Select Plan
                </Button>
              </div>



              {/* Adventure Upgrade */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-transparent hover:border-purple-300 transition-all">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plane className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">Adventure</h4>
                  <div className="text-3xl font-bold text-purple-600 mb-2">$45</div>
                  <p className="text-gray-600">per person</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">All Comprehensive Benefits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Adventure Sports Coverage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Equipment Protection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Search & Rescue</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                  onClick={() => {
                    setIsCompareModalOpen(false)
                    setIsQuoteModalOpen(true)
                  }}
                >
                  Select Plan
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">Need help choosing? Our experts can help you find the perfect coverage.</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Quote Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                Get Your Travel Insurance Quote
              </h3>
              <button 
                onClick={() => setIsQuoteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800">
                <strong>✈️ Smart Integration:</strong> We'll auto-fill your travel details from your hotel booking to make this super quick!
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure">Departure Date</Label>
                  <Input type="date" id="departure" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="return">Return Date</Label>
                  <Input type="date" id="return" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input type="text" id="destination" placeholder="Where are you traveling?" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="travelers">Number of Travelers</Label>
                  <Input type="number" id="travelers" placeholder="2" min="1" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="age">Primary Traveler Age</Label>
                  <Input type="number" id="age" placeholder="35" min="1" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="trip-cost">Total Trip Cost</Label>
                <Input type="number" id="trip-cost" placeholder="$5,000" className="mt-1" />
                <p className="text-xs text-gray-500 mt-1">Include hotels, flights, and activities</p>
              </div>
              <div>
                <Label htmlFor="coverage">Preferred Coverage Level</Label>
                <select className="w-full p-2 border border-gray-300 rounded-md mt-1">
                  <option>Basic Coverage ($15/person)</option>
                  <option>Comprehensive Coverage ($35/person)</option>
                  <option>Adventure Upgrade ($45/person)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input type="email" id="email" placeholder="your@email.com" className="mt-1" />
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-800 mb-2">🎁 Quote Benefits:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Instant personalized quote</li>
                  <li>• No obligation to purchase</li>
                  <li>• 24/7 customer support</li>
                  <li>• Special rates for hotel bookers</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold"
                  onClick={() => {
                    setIsQuoteModalOpen(false)
                    // Add quote logic here
                  }}
                >
                  Get Instant Quote
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 