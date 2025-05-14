'use client'

import { useState } from 'react'
import { LoginForm } from '@/components/auth/login-form'
import { SignUpForm } from '@/components/auth/signup-form'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="mt-2 text-gray-600">
                {isLogin
                  ? 'Sign in to your account to continue'
                  : 'Sign up to get started with our service'}
              </p>
            </div>

            {isLogin ? <LoginForm /> : <SignUpForm />}

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
        </div>
      </main>
    </div>
  )
} 