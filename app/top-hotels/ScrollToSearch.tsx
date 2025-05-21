'use client'

export default function ScrollToSearch() {
  const scrollToSearch = () => {
    const searchSection = document.querySelector('.search-section');
    searchSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button 
      onClick={scrollToSearch}
      className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors mt-2"
    >
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7-7-7M19 12H5"/>
      </svg>
      Find My Perfect Stay
    </button>
  );
} 