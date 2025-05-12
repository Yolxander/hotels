import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPin, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HotelTrackerForm } from "@/components/hotel-tracker-form"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/30 to-transparent"></div>
              <Image
                src="/hotel/glassgardensso.jpg?height=600&width=1000"
                alt="Luxury hotel room"
                width={1000}
                height={600}
                className="w-full h-[600px] object-cover"
              />

              <div className="absolute top-8 left-8 z-20">
                <div className="flex gap-2">
                  <Link href="/travel">
                    <Button
                      variant="ghost"
                      className="text-white bg-white/20 backdrop-blur-sm hover:bg-white hover:text-black rounded-full"
                    >
                      Travel
                    </Button>
                  </Link>
                  <Link href="/staycation">
                    <Button
                      variant="ghost"
                      className="text-white bg-white/20 backdrop-blur-sm hover:bg-white hover:text-black rounded-full"
                    >
                      Staycation
                    </Button>
                  </Link>
                  <Link href="/homestay">
                    <Button
                      variant="ghost"
                      className="text-white bg-white/20 backdrop-blur-sm hover:bg-white hover:text-black rounded-full"
                    >
                      Homestay
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="absolute bottom-16 left-16 z-20">
                <h1 className="text-6xl font-light text-white leading-tight">
                  Save <span className="italic font-normal">Money</span>
                  <br />
                  After You Book
                </h1>

                <div className="flex gap-2 mt-4">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50"></div>
                </div>
              </div>

              <div className="absolute top-1/4 right-8 z-20 bg-white p-6 rounded-2xl max-w-md">
                <h3 className="font-medium mb-2">Save Money After You Book</h3>
                <p className="text-gray-600 mb-4">
                  Our tool tracks hotel prices after you book and alerts you if prices drop, so you can cancel and
                  rebook to save money.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full rounded-full">
                    <Link href="/homestay">Start Tracking Prices</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full rounded-full">
                    <Link href="/explanation">Read Simple Explanation</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="space-y-6">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Homestay"
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 bg-white/80">
                        <Image src="/placeholder.svg?height=20&width=20" alt="Gallery" width={20} height={20} />
                      </Button>
                      <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 bg-white/80">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-4 right-4 rounded-full h-8 w-8 bg-white/80"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>

                    <div className="absolute bottom-4 left-4">
                      <h2 className="text-4xl font-semibold text-white">Homestay</h2>
                      <div className="flex items-center gap-1 text-white/90 text-sm mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>AB Street, Yogyakarta, Indonesia</span>
                        <Button variant="link" className="text-white underline ml-2 p-0 h-auto">
                          Directions
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <HotelTrackerForm />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative rounded-2xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=150&width=250"
                      alt="Bali, Indonesia"
                      width={250}
                      height={150}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-4 right-4 rounded-full h-8 w-8 bg-white/80"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 left-4 text-white font-medium">Bali, Indonesia</div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=150&width=250"
                      alt="Tokyo, Japan"
                      width={250}
                      height={150}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-4 right-4 rounded-full h-8 w-8 bg-white/80"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 left-4 text-white font-medium">Tokyo, Japan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
