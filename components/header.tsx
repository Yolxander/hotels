import Link from "next/link"
import { User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="font-semibold text-xl">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span> ICOTTAGE
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
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
          Dashboard
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
        <Button className="rounded-full bg-black text-white hover:bg-gray-800" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </header>
  )
} 