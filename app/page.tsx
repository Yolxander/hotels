import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPin, Play, Calendar as CalendarIcon, User as UserIcon, ChevronDown, Search as SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HotelTrackerForm } from "@/components/hotel-tracker-form"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <main className="bg-[#f9f9f9] px-4">
        {/* Hero Section */}
        <section className="relative w-full h-[600px] rounded-3xl overflow-hidden mx-auto mt-6  shadow-lg">
          <Image
            src="/hotel/glassgardensso.jpg" // Replace with your actual hero image path
            alt="Tent in the woods"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
            <h1 className="text-white text-3xl md:text-5xl font-light text-center leading-tight drop-shadow-lg">
              Secure Your Dream Vacation<br />with a Reservation
            </h1>
            {/* Search Bar */}
            <div className="mt-8 w-full max-w-3xl flex items-center bg-white rounded-full shadow-md px-2 py-1 gap-2">
              {/* Location */}
              <div className="flex items-center gap-2 px-4 py-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 text-base">Location</span>
                <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
              </div>
              {/* Divider */}
              <div className="h-8 w-px bg-gray-200 mx-1" />
              {/* Check in - Check out */}
              <div className="flex items-center gap-2 px-4 py-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 text-base">Check in - Check out</span>
                <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
              </div>
              {/* Divider */}
              <div className="h-8 w-px bg-gray-200 mx-1" />
              {/* Person */}
              <div className="flex items-center gap-2 px-4 py-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 text-base">Person</span>
                <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
              </div>
              {/* Search Button */}
              <button className="ml-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition">
                <SearchIcon className="h-5 w-5" />
                Search
              </button>
            </div>
            {/* Subtext & Stats */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mt-8">
              <div className="text-white text-sm md:text-base font-light md:text-left text-center max-w-md">
                We believe in the power of the great outdoors. We think that everyone deserves the chance to explore the wild and to find their very own adventure.
              </div>
              <div className="flex gap-8 mt-4 md:mt-0 text-white text-center">
                <div>
                  <div className="text-2xl font-bold">121+</div>
                  <div className="text-xs opacity-80">Capital Raised</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">80+</div>
                  <div className="text-xs opacity-80">Happy Costumers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">1K+</div>
                  <div className="text-xs opacity-80">Property options</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top-rated Hotel Section */}
        <section className="mx-auto mt-16 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 max-w-lg leading-tight">
              Our top-rated and<br />highly visited hotel
            </h2>
            <div className="text-gray-500 text-base max-w-md mt-4 md:mt-0 md:text-right">
              Discover our handpicked selection of the year's finest hotels, curated based on feedback from our delighted visitors
            </div>
          </div>
          {/* Carousel */}
          <div className="flex items-center gap-4">
            {/* Left arrow */}
            <button className="bg-white shadow-md rounded-full p-2 text-gray-500 hover:bg-gray-100">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            {/* Hotel Cards */}
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {/* Card 1 - Active */}
              <div className="min-w-[340px] max-w-[340px] bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-green-600">
                <Image
                  src="/hotel1.jpg" // Replace with your hotel image
                  alt="Grand Mega Hotel"
                  width={340}
                  height={180}
                  className="w-full h-44 object-cover"
                />
                <div className="p-6">
                  <div className="text-lg font-semibold">Grand Mega Hotel</div>
                  <div className="text-gray-500 text-sm mb-2">Denpasar, Bali</div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-yellow-400">★</span>
                    <span className="text-yellow-400">★</span>
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-300">★</span>
                    <span className="ml-2 text-gray-500 text-xs">(122 visitors)</span>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="min-w-[240px] max-w-[240px] bg-white rounded-3xl shadow-md overflow-hidden">
                <Image
                  src="/hotel2.jpg" // Replace with your hotel image
                  alt="Hotel 2"
                  width={240}
                  height={180}
                  className="w-full h-32 object-cover"
                />
              </div>
              {/* Card 3 */}
              <div className="min-w-[240px] max-w-[240px] bg-white rounded-3xl shadow-md overflow-hidden">
                <Image
                  src="/hotel3.jpg" // Replace with your hotel image
                  alt="Hotel 3"
                  width={240}
                  height={180}
                  className="w-full h-32 object-cover"
                />
              </div>
            </div>
            {/* Right arrow */}
            <button className="bg-white shadow-md rounded-full p-2 text-gray-500 hover:bg-gray-100">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
