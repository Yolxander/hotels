'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface TrackingSetupModalProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
  onSuccess: () => void
}

export function TrackingSetupModal({ isOpen, onClose, bookingId, onSuccess }: TrackingSetupModalProps) {
  const [isTracking, setIsTracking] = useState(true)
  const [notificationTypes, setNotificationTypes] = useState({
    email: false,
    message: false,
    in_platform: true
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleSave = async () => {
    if (!user) return
    setLoading(true)

    try {
      // Update booking's is_tracking field
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ is_tracking: isTracking })
        .eq('id', bookingId)

      if (bookingError) throw bookingError

      // Convert notification types to array
      const selectedTypes = Object.entries(notificationTypes)
        .filter(([_, selected]) => selected)
        .map(([type]) => type)

      // Update or insert notification preferences
      const { error: prefError } = await supabase
        .from('notification_preferences')
        .upsert({
          booking_id: bookingId,
          notification_types: selectedTypes
        })

      if (prefError) throw prefError

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error setting up tracking:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Up Price Tracking</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="tracking" className="text-base">
              Enable Price Tracking
            </Label>
            <Switch
              id="tracking"
              checked={isTracking}
              onCheckedChange={setIsTracking}
            />
          </div>
          
          <div className="space-y-4">
            <Label className="text-base">Notification Preferences</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in_platform"
                  checked={notificationTypes.in_platform}
                  onCheckedChange={(checked) => 
                    setNotificationTypes(prev => ({ ...prev, in_platform: checked as boolean }))
                  }
                />
                <Label htmlFor="in_platform">In Platform Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={notificationTypes.email}
                  onCheckedChange={(checked) => 
                    setNotificationTypes(prev => ({ ...prev, email: checked as boolean }))
                  }
                />
                <Label htmlFor="email">Email Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="message"
                  checked={notificationTypes.message}
                  onCheckedChange={(checked) => 
                    setNotificationTypes(prev => ({ ...prev, message: checked as boolean }))
                  }
                />
                <Label htmlFor="message">SMS Notifications</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 