import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import BottomNav from "@/components/BottomNav"
import MobileHeader from "@/components/MobileHeader"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Hotel Price Tracker - Save Money After You Book",
  description:
    "Our tool tracks hotel prices after you book and alerts you if prices drop, so you can cancel and rebook to save money.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-white"}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <MobileHeader />
            <div className="mt-[56px] md:mt-0">{children}</div>
            <BottomNav />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
