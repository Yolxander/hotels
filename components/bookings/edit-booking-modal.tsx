'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateBooking } from '@/app/actions/booking-actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface EditBookingModalProps {
  isOpen: boolean
  onClose: () => void
  booking: {
    id: string
    hotel: string
    location: string
    dates: string
    originalPrice: number
    currentPrice: number
    image: string
  }
}

export function EditBookingModal({ isOpen, onClose, booking }: EditBookingModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    hotel: booking.hotel,
    location: booking.location,
    dates: booking.dates,
    originalPrice: booking.originalPrice,
    currentPrice: booking.currentPrice,
    image: booking.image,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await updateBooking(booking.id, formData)
    
    if (result.success) {
      toast.success('Booking updated successfully')
      router.refresh() // This will trigger a revalidation of the page
      onClose()
    } else {
      toast.error(result.error || 'Failed to update booking')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotel">Hotel Name</Label>
            <Input
              id="hotel"
              value={formData.hotel}
              onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dates">Dates</Label>
            <Input
              id="dates"
              value={formData.dates}
              onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPrice">Current Price</Label>
              <Input
                id="currentPrice"
                type="number"
                value={formData.currentPrice}
                onChange={(e) => setFormData({ ...formData, currentPrice: Number(e.target.value) })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 