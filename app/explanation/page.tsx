import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ExplanationPage() {
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
          <h1 className="text-4xl font-bold mb-8">Simple Explanation for Your Parent (Non-Technical)</h1>

          <div className="bg-white p-8 rounded-xl shadow-sm mb-12">
            <div className="border-l-4 border-black pl-6 py-4 mb-8">
              <p className="text-xl mb-6">
                I'm building a tool that helps hotel guests{" "}
                <strong>save money even after they've already booked a room</strong>.
              </p>

              <p className="mb-4">Here's how it works:</p>

              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                  <span>
                    After someone books a hotel, they enter their booking details (like hotel name, check-in/check-out,
                    and what they paid).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                  <span>
                    My system will <strong>keep checking that same hotel and room every day</strong> to see if the price
                    drops.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                  <span>
                    If it finds a cheaper rate for the same room and dates, it{" "}
                    <strong>sends the guest an email to let them know</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                  <span>
                    The guest can then cancel and rebook (if their original booking is refundable), saving money without
                    doing anything.
                  </span>
                </li>
              </ul>

              <p>
                It's especially helpful for travelers who book early, because prices can go down later. It's like having
                a smart assistant always looking for better deals after you book.
              </p>
            </div>

            <div className="flex justify-between">
              <Button asChild variant="outline">
                <Link href="/task-breakdown">View Task Breakdown</Link>
              </Button>
              <Button asChild>
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
