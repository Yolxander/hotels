interface BookingListProps {
  bookings: Booking[];
  loading: boolean;
  onRebookNow: (booking: Booking) => void;
  onTrackingUpdate: () => void;
}

export function BookingList({ bookings, loading, onRebookNow, onTrackingUpdate }: BookingListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          hotel={booking.hotel_name}
          location={booking.location}
          dates={`${booking.check_in_date} - ${booking.check_out_date}`}
          originalPrice={booking.original_price}
          currentPrice={booking.current_price}
          savings={booking.savings}
          image={booking.image_url || "/placeholder.svg"}
          hasRoomListings={booking.hasRoomListings}
          isLoadingListings={booking.isLoadingListings}
        />
      ))}
    </div>
  );
} 