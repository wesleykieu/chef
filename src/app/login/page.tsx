'use client'

import { signIn } from "next-auth/react"
import { useEffect } from "react"

export default function LoginPage() {
  useEffect(() => {
    document.title = "Login – Chef"
  }, [])

  const handleLogin = () => {
    signIn("google")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-200 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Chef 👨‍🍳</h1>
        <p className="text-sm text-gray-500 mb-6">Plan smarter meals, powered by Google.</p>

        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-all"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
