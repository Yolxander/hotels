"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { User, Bell, ArrowRight, Info, HelpCircle, LayoutDashboard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<number>(0)

  const sections = [
    {
      id: "overview",
      title: "About Our Price Tracker",
      content: (
        <div className="space-y-4 text-white">
          <p className="text-xl">
            Welcome to ICOTTAGE's Hotel Price Tracker, the smart way to save money on your hotel bookings.
          </p>
          <p>
            Our service continuously monitors hotel prices after you've booked, alerting you when prices drop so you can
            cancel and rebook to save money.
          </p>
          <p>Select any option on the right to learn more about our service.</p>
        </div>
      ),
    },
    {
      id: "explanation",
      title: "Simple Explanation",
      content: (
        <div className="space-y-4 text-white">
          <h2 className="text-3xl font-medium">Simple Explanation</h2>
          <div className="border-l-4 border-white pl-4 py-2">
            <p className="text-xl">
              We help hotel guests <strong>save money even after they've already booked a room</strong>.
            </p>
          </div>
          <p>Here's how it works in simple terms:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You book a hotel and tell us the details</li>
            <li>Our system checks that hotel's prices every day</li>
            <li>If the price drops, we send you an email alert</li>
            <li>You can cancel your original booking and rebook at the lower price</li>
          </ul>
          <p>
            It's like having a friend constantly checking if your hotel room got cheaper, so you don't have to pay more
            than necessary.
          </p>
          <Button asChild className="mt-4 rounded-full">
            <Link href="/explanation">
              Read Full Explanation <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
    {
      id: "how-it-works",
      title: "How It Works",
      content: (
        <div className="space-y-4 text-white">
          <h2 className="text-3xl font-medium">How It Works</h2>
          <p className="text-xl">Our service works in three simple steps:</p>
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-medium">Enter Your Booking</h3>
                <p>Provide your hotel booking details including dates, room type, and price paid.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-medium">We Monitor Prices</h3>
                <p>Our system automatically checks prices for your exact room and dates multiple times per day.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-medium">Get Notified & Save</h3>
                <p>If we find a lower price, we'll immediately notify you so you can cancel and rebook.</p>
              </div>
            </div>
          </div>
          <Button asChild className="mt-4 rounded-full">
            <Link href="/how-it-works">
              See Detailed Steps <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
    {
      id: "dashboard",
      title: "Your Dashboard",
      content: (
        <div className="space-y-4 text-white">
          <h2 className="text-3xl font-medium">Your Dashboard</h2>
          <p className="text-xl">
            Your personalized dashboard gives you a complete overview of all your tracked hotel bookings.
          </p>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Dashboard Features:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Track multiple hotel bookings in one place</li>
              <li>See potential savings at a glance</li>
              <li>Get notified of price drops immediately</li>
              <li>View price history for your bookings</li>
              <li>Easily add new hotels to track</li>
            </ul>
          </div>
          <p>
            Your dashboard is the central hub for managing all your hotel price tracking and maximizing your potential
            savings.
          </p>
          <Button asChild className="mt-4 rounded-full">
            <Link href="/dashboard">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 z-10 bg-black/50"></div>
              <Image
                src="/hotel/splurge-hotel-soneva-jani.jpg?height=600&width=1000"
                alt="Luxury hotel room"
                width={1000}
                height={600}
                className="w-full h-[600px] object-cover"
              />

              <div className="absolute inset-0 z-20 p-16 flex flex-col justify-end">
                {sections[activeSection].content}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm h-full">
                <div className="p-6 flex flex-col h-full">
                  <h2 className="text-2xl font-semibold mb-4">Quick Navigation</h2>
                  <div className="space-y-4 flex-grow">
                    <button
                      onClick={() => setActiveSection(1)}
                      className={`block w-full text-left ${activeSection === 1 ? "bg-gray-100" : "hover:bg-gray-50"} transition-colors`}
                    >
                      <div className="border rounded-xl p-4 flex items-start gap-3">
                        <Info className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium">Simple Explanation</h3>
                          <p className="text-sm text-gray-600">Non-technical overview of our service</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveSection(2)}
                      className={`block w-full text-left ${activeSection === 2 ? "bg-gray-100" : "hover:bg-gray-50"} transition-colors`}
                    >
                      <div className="border rounded-xl p-4 flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium">How It Works</h3>
                          <p className="text-sm text-gray-600">Step-by-step guide to our price tracking</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveSection(3)}
                      className={`block w-full text-left ${activeSection === 3 ? "bg-gray-100" : "hover:bg-gray-50"} transition-colors`}
                    >
                      <div className="border rounded-xl p-4 flex items-start gap-3">
                        <LayoutDashboard className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium">Your Dashboard</h3>
                          <p className="text-sm text-gray-600">Track your hotel bookings and savings</p>
                        </div>
                      </div>
                    </button>
                  </div>
                  <Button asChild className="w-full rounded-full mt-4">
                    <Link href="/homestay">Start Tracking Prices</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
