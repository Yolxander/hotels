"use client"

import Link from "next/link"
import { LogOut, Bell, Calendar, Users, DollarSign, Building, Search, Menu, X } from "lucide-react"
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
import { useAuth } from '@/lib/auth-context'
import { AuthModal } from '@/components/auth/auth-modal'

export function Header() {
  const pathname = usePathname()
  const isDashboard = pathname === "/dashboard"
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="font-bold text-xl md:text-2xl">CocoStay</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            <>
              {/* Track Hotel link commented out
              <Button variant="ghost" size="sm" className="rounded-full" asChild>
                <Link href="/tracker">
                  <Search className="h-4 w-4 mr-2" />
                  Track Hotel
                </Link>
              </Button>
              */}
              <Button className="rounded-full bg-black text-white hover:bg-gray-800" asChild>
                <Link href={isDashboard ? "/" : "/dashboard"}>
                  {isDashboard ? "Home" : "Go to Dashboard"}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => signOut()}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              className="rounded-full bg-black text-white hover:bg-gray-800"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Login / Register
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-full"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container px-4 py-4 space-y-4">
            {user ? (
              <>
                {/* Track Hotel link commented out
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/tracker" className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    Track Hotel
                  </Link>
                </Button>
                */}
                <Button className="w-full justify-start bg-black text-white hover:bg-gray-800" asChild>
                  <Link href={isDashboard ? "/" : "/dashboard"}>
                    {isDashboard ? "Home" : "Go to Dashboard"}
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-500" onClick={() => signOut()}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                className="w-full bg-black text-white hover:bg-gray-800"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Login / Register
              </Button>
            )}
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  )
} 