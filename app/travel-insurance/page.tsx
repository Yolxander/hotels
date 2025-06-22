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

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <main className="bg-[#f9f9f9] px-1 md:px-4">
        
        {/* Hero Section */}
        <section className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden mx-auto m-6  shadow-lg">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">COVID-19 Protection</h3>
              <p className="text-gray-600 mb-4">Optional add-on</p>
              <Button variant="outline" className="w-full">From $25</Button>
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
                onClick={() => setIsQuoteModalOpen(true)}
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

      {/* Quote Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Get Your Quote</h3>
              <button 
                onClick={() => setIsQuoteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
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
                  <Label htmlFor="age">Traveler Age</Label>
                  <Input type="number" id="age" placeholder="35" min="1" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="trip-cost">Trip Cost</Label>
                <Input type="number" id="trip-cost" placeholder="5000" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="coverage">Coverage Type</Label>
                <select className="w-full p-2 border border-gray-300 rounded-md mt-1">
                  <option>Basic Coverage</option>
                  <option>Comprehensive Coverage</option>
                  <option>Premium Coverage</option>
                </select>
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Get Quote
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 