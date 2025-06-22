"use client";

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPin, Play, Calendar as CalendarIcon, User as UserIcon, ChevronDown, Search as SearchIcon } from "lucide-react"
import { useRef } from "react"

import { Button } from "@/components/ui/button"
import { HotelTrackerForm } from "@/components/hotel-tracker-form"
import { Header } from "@/components/header"
import Footer from './components/Footer'

export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Scroll carousel left/right
  const scrollCarousel = (dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector(".carousel-card");
    const cardWidth = card ? (card as HTMLElement).offsetWidth : 300;
    el.scrollBy({ left: dir === "left" ? -cardWidth - 24 : cardWidth + 24, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <main className="bg-[#f9f9f9] px-1 md:px-4">
        {/* Hero Section */}
        <section className="relative w-full h-[500px] md:h-[700px] rounded-3xl overflow-hidden mx-auto mt-6 shadow-lg">
          <Image
            src="/hotel/hotel-main.jpg"
            alt="Hotel price tracking hero"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
            <h1 className="text-white text-3xl md:text-6xl font-bold tracking-tight text-center leading-tight drop-shadow-lg">
              Save Money <span className="text-yellow-300">After</span> You Book<br />with PricePulse
            </h1>
         
            {/* Subtext & Stats */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mt-6 md:mt-8">
              <div className="text-white text-sm md:text-base font-medium md:text-left text-center max-w-md px-4 md:px-0">
                Booked a hotel? Let PricePulse track your reservation and find better deals automatically. We monitor price drops and compare offers across the web—so you never overpay again.
              </div>
              <div className="flex gap-6 md:gap-8 mt-4 md:mt-0 text-white text-center">
                <div>
                  <div className="text-2xl md:text-3xl font-bold">24/7</div>
                  <div className="text-xs opacity-80 font-medium">Price Monitoring</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold">100+</div>
                  <div className="text-xs opacity-80 font-medium">Sites Compared</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold">$1M+</div>
                  <div className="text-xs opacity-80 font-medium">Saved for Travelers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top-rated Hotel Section */}
        <section className="mx-auto mt-16 mb-16 px-2 md:px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-lg leading-tight">
              How PricePulse Works for You
            </h2>
            <div className="text-gray-500 text-lg max-w-md mt-4 md:mt-0 md:text-right font-medium">
              Enter your booking details once. We track your hotel's price, compare it across top travel sites, and alert you if you can rebook for less—no extra effort required.
            </div>
          </div>
          {/* Carousel */}
          <div className="relative flex items-center gap-2 md:gap-4">
            {/* Left arrow (desktop only) */}
            <button
              className="hidden md:block bg-white shadow-md rounded-full p-2 text-gray-500 hover:bg-gray-100 absolute left-0 z-10"
              style={{ top: "50%", transform: "translateY(-50%)" }}
              onClick={() => scrollCarousel("left")}
              aria-label="Scroll left"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            {/* Hotel Cards */}
            <div
              ref={carouselRef}
              className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide rounded-2xl bg-white/80 shadow-md px-2 py-4 md:px-4 md:py-6 scroll-smooth snap-x snap-mandatory"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {/* Card 1 */}
              <div className="carousel-card min-w-[260px] max-w-[260px] md:min-w-[450px] md:max-w-[450px] bg-white rounded-3xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-2 hover:border-green-600 snap-start">
                <div className="h-32 md:h-44 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <svg className="w-16 h-16 md:w-20 md:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="p-4 md:p-6">
                  <div className="text-lg md:text-2xl font-bold">Find Best Booking Prices</div>
                  <div className="text-gray-500 text-sm md:text-base mb-2 font-medium">We help you discover the most competitive rates for your dream hotel stay.</div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-gray-300 text-xl">★</span>
                    <span className="ml-2 text-gray-500 text-xs md:text-base font-medium">(98 travelers saved)</span>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="carousel-card min-w-[260px] max-w-[260px] md:min-w-[450px] md:max-w-[450px] bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-green-600 snap-start">
                <div className="h-32 md:h-44 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <svg className="w-16 h-16 md:w-20 md:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="p-4 md:p-6">
                  <div className="text-lg md:text-2xl font-bold">Automatic Price Drop Alerts</div>
                  <div className="text-gray-500 text-sm md:text-base mb-2 font-medium">We'll notify you if your room's price drops—so you can rebook and save instantly.</div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-gray-300 text-xl">★</span>
                    <span className="ml-2 text-gray-500 text-xs md:text-base font-medium">(122 travelers saved)</span>
                  </div>
                </div>
              </div>
              {/* Card 3 */}
              <div className="carousel-card min-w-[260px] max-w-[260px] md:min-w-[450px] md:max-w-[450px] bg-white rounded-3xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-2 hover:border-green-600 snap-start">
                <div className="h-32 md:h-44 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <svg className="w-16 h-16 md:w-20 md:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="p-4 md:p-6">
                  <div className="text-lg md:text-2xl font-bold">Monitor Current Bookings</div>
                  <div className="text-gray-500 text-sm md:text-base mb-2 font-medium">Keep track of price changes for your existing bookings to maximize savings.</div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-gray-300 text-xl">★</span>
                    <span className="ml-2 text-gray-500 text-xs md:text-base font-medium">(85 travelers saved)</span>
                  </div>
                </div>
              </div>
              {/* Card 4 */}
              <div className="carousel-card min-w-[260px] max-w-[260px] md:min-w-[450px] md:max-w-[450px] bg-white rounded-3xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-2 hover:border-green-600 snap-start">
                <div className="h-32 md:h-44 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <svg className="w-16 h-16 md:w-20 md:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="p-4 md:p-6">
                  <div className="text-lg md:text-2xl font-bold">Auto-Book Best Deals</div>
                  <div className="text-gray-500 text-sm md:text-base mb-2 font-medium">Never miss a great deal with our automatic booking system for the lowest prices.</div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-gray-300 text-xl">★</span>
                    <span className="ml-2 text-gray-500 text-xs md:text-base font-medium">(76 travelers saved)</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Right arrow (desktop only) */}
            <button
              className="hidden md:block bg-white shadow-md rounded-full p-2 text-gray-500 hover:bg-gray-100 absolute right-0 z-10"
              style={{ top: "50%", transform: "translateY(-50%)" }}
              onClick={() => scrollCarousel("right")}
              aria-label="Scroll right"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </section>


            {/* Event Banner Section */}
        <section className="relative w-full h-[600px] rounded-3xl overflow-hidden mx-auto mt-12">
          <Image
            src="/hotel/photo-15.jpeg" 
            alt="Snow Garden Hotel"
            fill
            className="object-cover w-full h-full"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col md:flex-row md:items-end md:justify-between z-10">
            <div>
              <div className="mb-2">
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">Upcoming Events</span>
              </div>
              <h2 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4">Upcoming event at<br />Snow Garden Hotel</h2>
              <div className="flex items-center gap-6 text-white/90 text-base font-medium">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>October 20, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>Snow Garden Hotel</span>
                </div>
              </div>
            </div>
            <button className="mt-8 md:mt-0 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-10 py-4 rounded-full text-lg shadow-lg transition">Book Now</button>
          </div>
        </section>

        {/* Dream Getaway Section */}
        <section className="w-full max-w-7xl mx-auto mt-20 flex flex-col md:flex-row items-center justify-between gap-12 ">
          {/* Left: Large Image */}
          <div className="flex-1 flex justify-center">
            <div className="rounded-3xl overflow-hidden w-[420px] h-[420px]">
              <Image
                src="/hotel/1_Hotel_ReceptionV2h1281.webp" // Replace with your actual image path
                alt="Hotel Reception"
                width={420}
                height={420}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          {/* Right: Text and Button */}
          <div className="flex-1 flex flex-col items-center md:items-start justify-center max-w-2xl text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-lg leading-tight mb-6">Your Dream Getaway<br />Awaits – Don't Wait!</h2>
            <p className="text-lg text-gray-700 mb-8">Ready to escape and create unforgettable memories? Book your stay now and experience luxury, comfort, and breathtaking views at Snow Garden Hotel.</p>
            <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold px-8 py-4 rounded-full text-lg shadow-lg flex items-center gap-2 transition mb-10 mx-auto md:mx-0">
              Reserve Your Stay Today!
              <ArrowUpRight className="h-5 w-5" />
            </button>
          </div>
        </section>

      </main>
      {/* Footer Section */}
      <Footer />
    </div>
  )
}
