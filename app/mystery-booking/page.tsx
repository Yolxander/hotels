"use client";

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPin, Calendar as CalendarIcon, User as UserIcon, Search as SearchIcon, Sparkles, Gift, Eye, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import Footer from '../components/Footer'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function MysteryBooking() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isRevealModalOpen, setIsRevealModalOpen] = useState(false)
  const [isLearnMoreModalOpen, setIsLearnMoreModalOpen] = useState(false)
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <main className="bg-[#f9f9f9] px-1 md:px-4">
        {/* Hero Section */}
        <section className="relative w-full h-[600px] md:h-[700px] rounded-3xl overflow-hidden mx-auto mt-6 shadow-lg">
          <Image
            src="/hotel/background-7158357_1280.jpg"
            alt="Mystery booking serene hotel room"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-start justify-center z-10 px-8 md:px-16">
            <div className="max-w-2xl">
              <div className="mb-4">
                <span className="bg-yellow-300/20 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2 w-fit">
                  <Sparkles className="h-4 w-4" />
                  Mystery Booking
                </span>
              </div>
              <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight leading-tight drop-shadow-lg mb-6">
                Not just a hotel, but a<br />
                <span className="text-yellow-300">place that feels like home</span>
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-medium mb-8 leading-relaxed">
                let's make your stay<br />
                unforgettable!
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-8 py-4 rounded-full text-lg shadow-lg flex items-center gap-2 transition"
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  <Gift className="h-5 w-5" />
                  Book Mystery Stay
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold px-8 py-4 rounded-full text-lg backdrop-blur-sm flex items-center gap-2 transition"
                  onClick={() => setIsRevealModalOpen(true)}
                >
                  <Eye className="h-5 w-5" />
                  Reveal Location
                </Button>
              </div>
              
              {/* Search Bar */}
              <div className="bg-white/95 backdrop-blur-sm rounded-full p-3 flex items-center gap-4 max-w-md shadow-lg">
                <SearchIcon className="h-5 w-5 text-gray-400 ml-2" />
                <input
                  type="text"
                  placeholder="Search Destination"
                  className="flex-1 outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
                />
                <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6">
                  Search
                </Button>
              </div>
            </div>
          </div>
          
          {/* Top right navigation pills */}
          <div className="absolute top-8 right-8 flex gap-3">
            <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              Wellness
            </Button>
            <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              Offers
            </Button>
            <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              Dining
            </Button>
          </div>
        </section>

        {/* Mystery Features Section */}
        <section className="mx-auto mt-16 mb-16 px-2 md:px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-lg leading-tight">
              The Magic of Mystery Booking
            </h2>
            <div className="text-gray-500 text-lg max-w-md mt-4 md:mt-0 md:text-right font-medium">
              Experience the thrill of discovering your perfect getaway. Our curated mystery bookings offer luxury at unbeatable prices—you'll know the location just 24 hours before your stay.
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-md p-8 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Surprise Destination</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover hidden gems and luxury properties you might never have considered. Every mystery booking is a curated experience.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-md p-8 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Unbeatable Prices</h3>
              <p className="text-gray-600 leading-relaxed">
                Save up to 60% on luxury accommodations. Mystery bookings offer the best value for premium experiences.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-md p-8 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">24-Hour Reveal</h3>
              <p className="text-gray-600 leading-relaxed">
                The excitement builds as we reveal your destination 24 hours before check-in. Perfect for spontaneous travelers.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative w-full h-[500px] rounded-3xl overflow-hidden mx-auto mt-16 mb-16">
          <Image
            src="/hotel/mystery-hotel.jpeg"
            alt="How mystery booking works"
            fill
            className="object-cover w-full h-full"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center z-10 px-8 md:px-16">
            <div className="max-w-2xl">
              <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-6">
                How Mystery Booking Works
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">1</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Choose Your Preferences</h3>
                    <p className="text-white/80">Select your travel dates, budget, and preferred amenities</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">2</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Book Your Mystery Stay</h3>
                    <p className="text-white/80">Secure your booking with our special mystery rates</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">3</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Destination Revealed</h3>
                    <p className="text-white/80">Receive your hotel details 24 hours before check-in</p>
                  </div>
                </div>
              </div>
              <Button 
                className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-8 py-4 rounded-full text-lg shadow-lg flex items-center gap-2 transition"
                onClick={() => setIsBookingModalOpen(true)}
              >
                Start Your Mystery Adventure
                <ArrowUpRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-4xl mx-auto mt-20 mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Ready for Your Mystery Adventure?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered their perfect getaway through our mystery booking service. Your next unforgettable experience awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-10 py-4 rounded-full text-lg shadow-lg flex items-center gap-2 transition"
              onClick={() => setIsBookingModalOpen(true)}
            >
              <Gift className="h-5 w-5" />
              Book Mystery Experience
              <ArrowUpRight className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-10 py-4 rounded-full text-lg flex items-center gap-2 transition"
              onClick={() => setIsLearnMoreModalOpen(true)}
            >
              Learn More
            </Button>
          </div>
        </section>

      </main>
      {/* Footer Section */}
      <Footer />

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Gift className="h-6 w-6 text-yellow-500" />
              Book Mystery Stay
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkin">Check-in Date</Label>
                  <Input type="date" id="checkin" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="checkout">Check-out Date</Label>
                  <Input type="date" id="checkout" className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guests">Guests</Label>
                  <Input type="number" id="guests" placeholder="2" min="1" max="8" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <select className="w-full p-2 border border-gray-300 rounded-md mt-1">
                    <option>$100-200/night</option>
                    <option>$200-400/night</option>
                    <option>$400-600/night</option>
                    <option>$600+/night</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="preferences">Special Preferences</Label>
                <textarea 
                  id="preferences" 
                  placeholder="Beach view, spa, gym, pet-friendly, etc."
                  className="w-full p-2 border border-gray-300 rounded-md mt-1 h-20 resize-none"
                />
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-800 mb-2">🎁 Mystery Booking Benefits:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Save up to 60% on luxury hotels</li>
                <li>• Curated selection of premium properties</li>
                <li>• Location revealed 24 hours before check-in</li>
                <li>• Guaranteed 4+ star accommodations</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-yellow-300 hover:bg-yellow-400 text-gray-900"
                onClick={() => {
                  setIsBookingModalOpen(false)
                  // Add booking logic here
                }}
              >
                Book Mystery Stay
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reveal Location Modal */}
      <Dialog open={isRevealModalOpen} onOpenChange={setIsRevealModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Eye className="h-6 w-6 text-blue-500" />
              Reveal Location
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location Preview Available</h3>
              <p className="text-gray-600 mb-4">
                Ready to discover your mystery destination? For active bookings, we reveal the exact location 24 hours before your stay.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-800 mb-2">🗺️ What you'll get:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Exact hotel name and address</li>
                <li>• Photos and amenities details</li>
                <li>• Local area information</li>
                <li>• Check-in instructions</li>
              </ul>
            </div>

                         <div className="space-y-3">
               <div>
                 <Label htmlFor="email">Email Address</Label>
                 <Input 
                   type="email" 
                   id="email" 
                   placeholder="your@email.com"
                   className="mt-1"
                 />
               </div>
             </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsRevealModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  setIsRevealModalOpen(false)
                  // Add reveal logic here
                }}
              >
                Reveal Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Learn More Modal */}
      <Dialog open={isLearnMoreModalOpen} onOpenChange={setIsLearnMoreModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-500" />
              About Mystery Booking
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">What is Mystery Booking?</h3>
              <p className="text-gray-600 leading-relaxed">
                Mystery Booking is our innovative way to offer luxury hotel experiences at incredible prices. 
                You book based on your preferences and budget, and we surprise you with a carefully curated 
                hotel that exceeds your expectations.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">How It Works</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold mt-0.5">1</div>
                  <div>
                    <h4 className="font-medium">Set Your Preferences</h4>
                    <p className="text-sm text-gray-600">Choose dates, budget, and desired amenities</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold mt-0.5">2</div>
                  <div>
                    <h4 className="font-medium">We Curate Your Stay</h4>
                    <p className="text-sm text-gray-600">Our experts select the perfect hotel matching your criteria</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold mt-0.5">3</div>
                  <div>
                    <h4 className="font-medium">Big Reveal</h4>
                    <p className="text-sm text-gray-600">Location disclosed 24 hours before your arrival</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Why Choose Mystery Booking?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800">💰 Unbeatable Savings</h4>
                  <p className="text-sm text-green-700">Save 40-60% on luxury accommodations</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800">🎯 Curated Selection</h4>
                  <p className="text-sm text-blue-700">Only premium 4+ star properties</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-800">🌟 Surprise Element</h4>
                  <p className="text-sm text-purple-700">Discover hidden gems and new favorites</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <h4 className="font-medium text-orange-800">🛡️ Quality Guarantee</h4>
                  <p className="text-sm text-orange-700">100% satisfaction or full refund</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm">Can I cancel my mystery booking?</h4>
                  <p className="text-sm text-gray-600">Yes, free cancellation up to 48 hours before check-in.</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">What if I don't like the revealed hotel?</h4>
                  <p className="text-sm text-gray-600">We offer a full refund if you're not satisfied with our selection.</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Is there a minimum star rating?</h4>
                  <p className="text-sm text-gray-600">All mystery bookings are guaranteed 4+ star properties.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsLearnMoreModalOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                onClick={() => {
                  setIsLearnMoreModalOpen(false)
                  setIsBookingModalOpen(true)
                }}
              >
                Book Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 