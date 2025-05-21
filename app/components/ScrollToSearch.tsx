'use client'

export default function ScrollToSearch() {
  const scrollToSearch = () => {
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
      const yOffset = -window.innerHeight / 2 + searchSection.getBoundingClientRect().height / 2;
      const y = searchSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });

      // Add a small delay to ensure the scroll is complete before focusing
      setTimeout(() => {
        const locationInput = searchSection.querySelector('input[type="text"]');
        if (locationInput instanceof HTMLInputElement) {
          locationInput.focus();
        }
      }, 800); // 800ms delay to match the smooth scroll duration
    }
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