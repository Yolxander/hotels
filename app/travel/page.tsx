import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HotelTrackerForm } from "@/components/hotel-tracker-form"

export default function TravelPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <header className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-xl">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🏠</span> ICOTTAGE
            </Link>
          </div>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Travel Price Tracker</h1>

          <div className="bg-white p-8 rounded-xl shadow-sm mb-12">
            <h2 className="text-2xl font-semibold mb-6">Save Money on Your Travel Bookings</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-black pl-4 py-2">
                <p className="text-lg">
                  I'm building a tool that helps travelers{" "}
                  <strong>save money even after they've already booked a room</strong>.
                </p>
              </div>

              <p>Here's how it works:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  After you book a hotel, enter your booking details (like hotel name, check-in/check-out, and what you
                  paid).
                </li>
                <li>
                  Our system will <strong>keep checking that same hotel and room every day</strong> to see if the price
                  drops.
                </li>
                <li>
                  If we find a cheaper rate for the same room and dates, we{" "}
                  <strong>send you an email to let you know</strong>.
                </li>
                <li>
                  You can then cancel and rebook (if your original booking is refundable), saving money without doing
                  anything.
                </li>
              </ul>

              <p>
                It's especially helpful for travelers who book early, because prices can go down later. It's like having
                a smart assistant always looking for better deals after you book.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Start Tracking Your Travel Booking</h2>
            <HotelTrackerForm standalone={true} />
          </div>
        </div>
      </main>
    </div>
  )
}
