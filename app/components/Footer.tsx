import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#181a1b] py-16 px-4 mt-24 rounded-t-3xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-12">
        {/* Left: Logo and Socials */}
        <div className="flex flex-col items-center md:items-start flex-1">
          <div className="text-6xl font-bold text-yellow-300 mb-8">PricePulse</div>
          <div className="flex gap-4 mb-4">
            {/* Social Icons */}
            <a href="#" className="bg-[#232526] rounded-full p-3 flex items-center justify-center"><svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><polygon points="10 15 15 12 10 9 10 15"/></svg></a>
            <a href="#" className="bg-[#232526] rounded-full p-3 flex items-center justify-center"><svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 9h.01M15 9h.01M7 15c1.5-2 8.5-2 10 0"/></svg></a>
            <a href="#" className="bg-[#232526] rounded-full p-3 flex items-center justify-center"><svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 8a6 6 0 0 1-8 8"/><circle cx="12" cy="12" r="2"/></svg></a>
            <a href="#" className="bg-[#232526] rounded-full p-3 flex items-center justify-center"><svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37V7a4 4 0 0 0-8 0v4.37"/><path d="M5 20h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2z"/></svg></a>
            <a href="#" className="bg-[#232526] rounded-full p-3 flex items-center justify-center"><svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8a6 6 0 0 1-8 8"/><circle cx="12" cy="12" r="2"/></svg></a>
          </div>
        </div>
        {/* Right: Links */}
        <div className="flex-1 flex flex-col md:flex-row justify-end gap-16">
          <div>
            <div className="text-white text-lg font-semibold mb-4">Company</div>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-300 transition">Our Mission</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-300 transition">Our Vision</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-300 transition">Our Story</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-300 transition">Meet Our Team</a></li>
            </ul>
          </div>
          <div>
            <div className="text-white text-lg font-semibold mb-4">Features</div>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-300 transition">Find Hotels</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-300 transition">Book Hotels</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-300 transition">Plan a Trip</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-300 transition">Write a Review</a></li>
            </ul>
          </div>
          <div>
            <div className="text-white text-lg font-semibold mb-4">Help</div>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-300 transition">Term of Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-300 transition">Customer Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 