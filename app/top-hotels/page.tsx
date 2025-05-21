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

        {/* Amazing Hotels Section */}
        <section className="max-w-8xl mx-auto mt-24 mb-16 px-2 md:px-0">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-2">Our Most<br className='md:hidden'/> Amazing Hotels</h2>
          <p className="text-gray-600 text-lg text-center mb-10">Discover the perfect accommodation for your stay worldwide.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Left: Large Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg h-[380px] md:h-[540px] flex flex-col justify-end">
              <img src="/hotel/emerald-valley-lodge.jpg" alt="Emerald Valley Lodge" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="relative z-10 p-8">
                <div className="text-white text-2xl md:text-3xl font-bold mb-1">Emerald Valley Lodge</div>
                <div className="text-gray-200 text-base mb-2">Palm Jumeirah, Dubai</div>
                <div className="flex items-center gap-2 text-yellow-400 mb-1">
                  <span>★★★★★</span>
                  <span className="text-gray-200 text-sm">(5525 Visitors)</span>
                </div>
                <span className="absolute bottom-8 right-8 text-white bg-white/20 rounded-full p-2"><svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></span>
              </div>
            </div>
            {/* Right: Two Small Cards Stacked */}
            <div className="flex flex-col gap-6 h-[380px] md:h-[540px]">
              {/* Small Card 1 */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg flex-1 min-h-[120px] flex flex-col justify-end">
                <img src="/hotel/saroza-hotel-pool.jpg" alt="Saroza Hotel" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative z-10 p-6">
                  <div className="text-white text-xl font-bold mb-1">Saroza Hotel</div>
                  <div className="text-gray-200 text-sm mb-1">Malang, Indonesia</div>
                  <div className="flex items-center gap-2 text-yellow-400 mb-1">
                    <span>★★★★☆</span>
                    <span className="text-gray-200 text-xs">(4983 Visitors)</span>
                  </div>
                  <span className="absolute bottom-6 right-6 text-white bg-white/20 rounded-full p-2"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></span>
                </div>
              </div>
              {/* Small Card 2 */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg flex-1 min-h-[120px] flex flex-col justify-end">
                <img src="/hotel/saroza-hotel-room.jpg" alt="Saroza Hotel" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative z-10 p-6">
                  <div className="text-white text-xl font-bold mb-1">Saroza Hotel</div>
                  <div className="text-gray-200 text-sm mb-1">Malang, Indonesia</div>
                  <div className="flex items-center gap-2 text-yellow-400 mb-1">
                    <span>★★★★☆</span>
                    <span className="text-gray-200 text-xs">(4983 Visitors)</span>
                  </div>
                  <span className="absolute bottom-6 right-6 text-white bg-white/20 rounded-full p-2"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5-Star Hotels Section */}
        <section className="max-w-7xl mx-auto mb-24 px-2 md:px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6 md:gap-0">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-2 md:mb-0 text-left">Explore our<br />5-Star Hotels</h2>
            </div>
            <div className="flex-1 flex flex-col md:items-end">
              <p className="text-gray-600 text-lg mb-4 md:mb-2 text-left md:text-right">Discover the perfect accommodation for your stay worldwide.</p>
              <div className="relative w-full md:w-[340px]">
                <input type="text" placeholder="Find Hotels" className="w-full rounded-full bg-gray-100 py-3 pl-6 pr-12 text-lg shadow focus:outline-none" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="rounded-2xl overflow-hidden shadow bg-white">
              <img src="/hotel/emerald-valley-lodge-2.jpg" alt="Emerald Valley Lodge" className="w-full h-48 object-cover" />
              <div className="p-5">
                <div className="font-bold text-xl mb-1">Emerald Valley Lodge</div>
                <div className="text-gray-500 text-sm mb-2">New Zealand, Australia</div>
                <div className="flex items-center gap-2 text-yellow-500 text-base">
                  <span>★★★★★</span>
                  <span className="text-gray-500 text-sm">(8768 Visitors)</span>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="rounded-2xl overflow-hidden shadow bg-white">
              <img src="/hotel/summer-resort.jpg" alt="Summer Resort" className="w-full h-48 object-cover" />
              <div className="p-5">
                <div className="font-bold text-xl mb-1">Summer Resort</div>
                <div className="text-gray-500 text-sm mb-2">Manchester, London</div>
                <div className="flex items-center gap-2 text-yellow-500 text-base">
                  <span>★★★★★</span>
                  <span className="text-gray-500 text-sm">(9768 Visitors)</span>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="rounded-2xl overflow-hidden shadow bg-white">
              <img src="/hotel/greeny-hotel.jpg" alt="Greeny Hotel" className="w-full h-48 object-cover" />
              <div className="p-5">
                <div className="font-bold text-xl mb-1">Greeny Hotel</div>
                <div className="text-gray-500 text-sm mb-2">Malang, Indonesia</div>
                <div className="flex items-center gap-2 text-yellow-500 text-base">
                  <span>★★★★★</span>
                  <span className="text-gray-500 text-sm">(168 Visitors)</span>
                </div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="rounded-2xl overflow-hidden shadow bg-white">
              <img src="/hotel/golden-horizon.jpg" alt="Golden Horizon Hotel" className="w-full h-48 object-cover" />
              <div className="p-5">
                <div className="font-bold text-xl mb-1">Golden Horizon Hotel</div>
                <div className="text-gray-500 text-sm mb-2">New York, USA</div>
                <div className="flex items-center gap-2 text-yellow-500 text-base">
                  <span>★★★★★</span>
                  <span className="text-gray-500 text-sm">(3455 Visitors)</span>
                </div>
              </div>
            </div>
            {/* Card 5 */}
            <div className="rounded-2xl overflow-hidden shadow bg-white">
              <img src="/hotel/boulevard.jpg" alt="Boulevard" className="w-full h-48 object-cover" />
              <div className="p-5">
                <div className="font-bold text-xl mb-1">Boulevard</div>
                <div className="text-gray-500 text-sm mb-2">Tokyo, Japan</div>
                <div className="flex items-center gap-2 text-yellow-500 text-base">
                  <span>★★★★★</span>
                  <span className="text-gray-500 text-sm">(768 Visitors)</span>
                </div>
              </div>
            </div>
            {/* Card 6 */}
            <div className="rounded-2xl overflow-hidden shadow bg-white">
              <img src="/hotel/palm-yard.jpg" alt="Palm Yard" className="w-full h-48 object-cover" />
              <div className="p-5">
                <div className="font-bold text-xl mb-1">Palm Yard</div>
                <div className="text-gray-500 text-sm mb-2">Catalan, Barcelona</div>
                <div className="flex items-center gap-2 text-yellow-500 text-base">
                  <span>★★★★★</span>
                  <span className="text-gray-500 text-sm">(3768 Visitors)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 