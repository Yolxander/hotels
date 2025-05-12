"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { User, Bell, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState<number>(0)

  const steps = [
    {
      id: "overview",
      title: "How It Works",
      content: (
        <div className="space-y-4 text-white">
          <p className="text-xl">Our hotel price tracker helps you save money even after you've booked your stay.</p>
          <p>Select any step on the right to learn more about how our service works.</p>
        </div>
      ),
    },
    {
      id: "step1",
      title: "Step 1: Enter Your Booking",
      content: (
        <div className="space-y-4 text-white">
          <h2 className="text-3xl font-medium">Enter Your Booking</h2>
          <p className="text-xl">After booking your hotel, simply enter your booking details into our system.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Hotel name and location</li>
            <li>Check-in and check-out dates</li>
            <li>Room type and number of guests</li>
            <li>Price you paid</li>
          </ul>
          <p>It only takes a minute, and you can even upload your booking confirmation for faster entry.</p>
        </div>
      ),
    },
    {
      id: "step2",
      title: "Step 2: We Monitor Prices",
      content: (
        <div className="space-y-4 text-white">
          <h2 className="text-3xl font-medium">We Monitor Prices</h2>
          <p className="text-xl">
            Our system automatically checks prices for your exact room and dates multiple times per day.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Continuous monitoring across multiple booking sites</li>
            <li>Checks for the exact same room type and dates</li>
            <li>Verifies that the new rate includes the same amenities and cancellation policy</li>
            <li>Runs 24/7 until your check-in date</li>
          </ul>
          <p>You don't need to do anything - just sit back and let our system do the work.</p>
        </div>
      ),
    },
    {
      id: "step3",
      title: "Step 3: Get Notified & Save",
      content: (
        <div className="space-y-4 text-white">
          <h2 className="text-3xl font-medium">Get Notified & Save</h2>
          <p className="text-xl">If we find a lower price, we'll immediately notify you so you can take action.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Receive instant email alerts when prices drop</li>
            <li>View detailed instructions on how to cancel and rebook</li>
            <li>See exactly how much you'll save</li>
            <li>Track all your potential savings in your dashboard</li>
          </ul>
          <p>
            If your original booking has free cancellation, you can cancel and rebook at the lower rate, pocketing the
            difference!
          </p>
          <Button className="mt-4 rounded-full">
            Start Tracking Now <ArrowRight className="ml-2 h-4 w-4" />
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
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/30 to-transparent"></div>
              <Image
                src="/hotel/news-main-lti-highlights.jpg?height=600&width=1000"
                alt="Luxury hotel room"
                width={1000}
                height={600}
                className="w-full h-[600px] object-cover"
              />

              <div className="absolute inset-0 z-20 p-16 flex flex-col justify-end">{steps[activeStep].content}</div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm h-full">
                <div className="p-6 flex flex-col h-full">
                  <h2 className="text-2xl font-semibold mb-4">Quick Navigation</h2>
                  <div className="space-y-4 flex-grow">
                    <button
                      onClick={() => setActiveStep(1)}
                      className={`block w-full text-left ${activeStep === 1 ? "bg-gray-100" : "hover:bg-gray-50"} transition-colors`}
                    >
                      <div className="border rounded-xl p-4">
                        <h3 className="font-medium">Step 1: Enter Your Booking</h3>
                        <p className="text-sm text-gray-600">Provide your hotel booking details</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveStep(2)}
                      className={`block w-full text-left ${activeStep === 2 ? "bg-gray-100" : "hover:bg-gray-50"} transition-colors`}
                    >
                      <div className="border rounded-xl p-4">
                        <h3 className="font-medium">Step 2: We Monitor Prices</h3>
                        <p className="text-sm text-gray-600">Our system checks prices daily</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveStep(3)}
                      className={`block w-full text-left ${activeStep === 3 ? "bg-gray-100" : "hover:bg-gray-50"} transition-colors`}
                    >
                      <div className="border rounded-xl p-4">
                        <h3 className="font-medium">Step 3: Get Notified & Save</h3>
                        <p className="text-sm text-gray-600">Receive alerts when prices drop</p>
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
