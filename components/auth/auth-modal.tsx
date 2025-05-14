'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { LoginForm } from './login-form'
import { SignUpForm } from './signup-form'
import { Button } from '@/components/ui/button'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-gray-500">
              {isLogin
                ? 'Sign in to your account to continue'
                : 'Sign up to get started with our service'}
            </p>
          </div>

          {isLogin ? <LoginForm onSuccess={onClose} /> : <SignUpForm onSuccess={onClose} />}

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 