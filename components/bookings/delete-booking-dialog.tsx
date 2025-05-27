'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { deleteBooking } from '@/app/actions/booking-actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface DeleteBookingDialogProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
}

export function DeleteBookingDialog({ isOpen, onClose, bookingId }: DeleteBookingDialogProps) {
  const router = useRouter()

  const handleDelete = async () => {
    const result = await deleteBooking(bookingId)
    
    if (result.success) {
      toast.success('Booking deleted successfully')
      router.refresh() // This will trigger a revalidation of the page
      onClose()
    } else {
      toast.error(result.error || 'Failed to delete booking')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this booking? This action will remove the room connected to it and cannot be recovered.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 