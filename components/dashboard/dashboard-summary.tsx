'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Booking } from '@/app/types/booking'

interface DashboardSummaryProps {
  activeTrackers: number
  priceDrops: number
  totalSavings: number
}

export function DashboardSummary({ activeTrackers, priceDrops, totalSavings }: DashboardSummaryProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm h-full">
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-2xl font-semibold mb-4">Price Tracking Overview</h2>
        <div className="space-y-4 flex-grow">
          <div className="border rounded-xl p-4">
            <h3 className="font-medium">Active Trackers</h3>
            <p className="text-2xl font-semibold">{activeTrackers}</p>
          </div>
          <div className={`border rounded-xl p-4 ${priceDrops > 0 ? 'bg-yellow-300 border-yellow-100' : ''}`}>
            <h3 className={`font-medium ${priceDrops > 0 ? 'text-black' : ''}`}>Price Drops Found</h3>
            <p className={`text-2xl font-semibold ${priceDrops > 0 ? 'text-black' : ''}`}>{priceDrops}</p>
          </div>
          <div className="border rounded-xl p-4">
            <h3 className="font-medium">Potential Savings</h3>
            <p className="text-2xl font-semibold underline decoration-4 decoration-yellow-300">${totalSavings}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 