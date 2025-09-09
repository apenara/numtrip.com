'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-light to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center justify-center">
            <MapPin className="h-10 w-10 text-primary-blue" />
            <span className="ml-2 text-2xl font-bold text-gray-900">NumTrip</span>
          </Link>
        </div>
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication error</h2>
          <p className="text-gray-600 mb-6">There was a problem completing the sign-in process. Please try again.</p>
          <div className="space-y-3">
            <Link href="/auth/login" className="btn-primary inline-block w-full py-3">
              Back to Login
            </Link>
            <Link href="/auth/register" className="inline-block w-full py-3 border rounded-lg text-gray-700 hover:bg-gray-50">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


