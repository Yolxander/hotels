import Image from "next/image"
import { Header } from "@/components/header"
import Footer from '../components/Footer'

export default function TopHotels() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
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
                Stay Quietly<br className="hidden md:block" />with No Worries
              </h1>
              <p className="text-white text-lg md:text-2xl font-medium text-left max-w-xl mb-6">
                Discover the perfect accommodation for your stay worldwide. Make your travel experience become easier and more enjoyable
              </p>
            </div>
            {/* Right: Stats */}
            <div className="flex flex-col gap-8 items-end justify-center md:justify-end md:pb-44 min-w-[180px]">
              <div className="text-white text-4xl md:text-5xl font-bold text-right">12k+<div className="text-base font-normal">Satisfied Visitors</div></div>
              <div className="text-white text-4xl md:text-5xl font-bold text-right">4.5k+<div className="text-base font-normal">Tour Guides</div></div>
              <div className="text-white text-4xl md:text-5xl font-bold text-right">2k+<div className="text-base font-normal">Special Travel</div></div>
            </div>
          </div>
          {/* Search Bar */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-12 md:bottom-12 w-[95%] md:w-4/5 bg-white rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between px-4 py-6 gap-4 z-20">
            {/* Location */}
            <div className="flex flex-col items-start flex-1 min-w-[150px]">
              <label className="font-semibold text-gray-900 flex items-center gap-2 mb-2"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="10"/><path d="M11 15v-4"/><path d="M11 7h.01"/></svg>Location</label>
              <input type="text" placeholder="Location" className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 focus:outline-none" />
            </div>
            {/* Person */}
            <div className="flex flex-col items-start flex-1 min-w-[150px]">
              <label className="font-semibold text-gray-900 flex items-center gap-2 mb-2"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 11 0"/></svg>Person</label>
              <select className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 focus:outline-none">
                <option>Person</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4+</option>
              </select>
            </div>
            {/* Check in */}
            <div className="flex flex-col items-start flex-1 min-w-[150px]">
              <label className="font-semibold text-gray-900 flex items-center gap-2 mb-2"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="16" height="16" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h16"/></svg>Check in</label>
              <input type="date" className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 focus:outline-none" />
            </div>
            {/* Check out */}
            <div className="flex flex-col items-start flex-1 min-w-[150px]">
              <label className="font-semibold text-gray-900 flex items-center gap-2 mb-2"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="16" height="16" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h16"/></svg>Check out</label>
              <input type="date" className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-700 focus:outline-none" />
            </div>
            {/* Search Button */}
            <button className="w-full md:w-auto bg-black text-white font-semibold rounded-xl px-8 py-4 mt-2 md:mt-7 text-lg transition hover:bg-gray-900">Search</button>
          </div>
        </section>

        {/* Content will go here */}
      </main>
      <Footer />
    </div>
  )
} 