"use client"

import Link from "next/link"
import { User, Bell, Calendar, Users, DollarSign, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Header() {
  const pathname = usePathname()
  const isDashboard = pathname === "/dashboard"
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <header className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="font-semibold text-xl">
          <Link href="/" className="flex items-center gap-2">
            CocoStay
          </Link>
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/about" className="text-gray-600 hover:text-gray-900">
          About
        </Link>
        <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
          How It Works
        </Link>
        <Link href={isDashboard ? "/" : "/dashboard"} className="text-gray-600 hover:text-gray-900">
          {isDashboard ? "Home" : "Dashboard"}
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
          <span>EN</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 5L6 8L9 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        {isDashboard ? (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-black text-white hover:bg-gray-800">
                Track New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center mb-6">Track New Booking</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="hotel"
                      placeholder="Enter hotel name"
                      className="pl-10 h-12 rounded-lg border-gray-200 focus:border-black focus:ring-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="checkIn"
                        type="date"
                        className="pl-10 h-12 rounded-lg border-gray-200 focus:border-black focus:ring-black"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="checkOut"
                        type="date"
                        className="pl-10 h-12 rounded-lg border-gray-200 focus:border-black focus:ring-black"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="guests"
                      type="number"
                      placeholder="Number of guests"
                      className="pl-10 h-12 rounded-lg border-gray-200 focus:border-black focus:ring-black"
                    />
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="currentPrice"
                      type="number"
                      placeholder="Enter current booking price"
                      className="pl-10 h-12 rounded-lg border-gray-200 focus:border-black focus:ring-black"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg bg-black text-white hover:bg-gray-800 px-6"
                  >
                    Start Tracking
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Button className="rounded-full bg-black text-white hover:bg-gray-800" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        )}
      </div>
    </header>
  )
} 