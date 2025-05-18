"use client"

import Link from "next/link"
import { LogOut, Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuth } from '@/lib/auth-context'
import { AuthModal } from '@/components/auth/auth-modal'

export function Header() {
  const pathname = usePathname()
  const isDashboard = pathname === "/dashboard"
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="font-bold text-2xl">CocoStay</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            <>
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
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container px-4 py-4 space-y-4">
            {user ? (
              <>
                <Button className="w-full justify-start rounded-xl bg-black text-white hover:bg-gray-800" asChild>
                  <Link href={isDashboard ? "/" : "/dashboard"} onClick={() => setIsMobileMenuOpen(false)}>
                    {isDashboard ? "Home" : "Go to Dashboard"}
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50" 
                  onClick={() => {
                    signOut()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                className="w-full rounded-xl bg-black text-white hover:bg-gray-800"
                onClick={() => {
                  setIsAuthModalOpen(true)
                  setIsMobileMenuOpen(false)
                }}
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