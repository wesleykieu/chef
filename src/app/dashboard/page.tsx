'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

const meals = [
  { title: 'Meal 1', description: 'Description of meal 1.' },
  { title: 'Meal 2', description: 'Description of meal 2.' },
  { title: 'Meal 3', description: 'Description of meal 3.' },
  { title: 'Meal 4', description: 'Description of meal 4.' },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()

  const [currentMealIndex, setCurrentMealIndex] = useState(0)

  // Automatic slideshow - change meal every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMealIndex((prevIndex) => (prevIndex + 1) % meals.length)
    }, 4000)

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  if (status === 'loading') return <p>Loading...</p>
  if (status === 'unauthenticated') {
    // Optional: redirect or message
    return <p>You must be logged in to view this page.</p>
  }

  return (
    <div className="flex p-6">
      {/* Left Side: Google Calendar */}
      <div className="w-1/3 pr-6 mt-1">
        <h2 className="text-xl font-semibold mb-4">Your Google Calendar</h2>
        <iframe
          src={`https://calendar.google.com/calendar/embed?src=${session?.user?.email}&ctz=America%2FNew_York&mode=AGENDA`}
          style={{
            border: 0,
            width: '100%',
            height: '90vh', // Ensure it takes full height of the viewport
          }}
          frameBorder="0"
        />
      </div>

      {/* Right Side: Profile and Content */}
      <div className="w-2/3">
        {/* Profile Header - Top Right */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold mt">Hello, {session?.user?.name}!</h1>
          <div className="flex items-center space-x-4">
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt="User Profile"
                className="w-12 h-12 rounded-full"
              />
            )}
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Potential Meals Slideshow Section */}
        <div className="p-6 bg-gray-100 rounded-xl shadow-md w-full max-w-xs overflow-hidden">
          <h2 className="text-2xl font-semibold mb-4 text-gray-950">Potential Meal</h2>

          {/* Slideshow Container */}
          <div
            className="relative"
            style={{ height: '200px', position: 'relative' }}
          >
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(-${currentMealIndex * 100}%)`,
                display: 'flex',
                gap: '16px', // Add space between items
              }}
            >
              {meals.map((meal, index) => (
                <div
                  key={index}
                  className="w-full p-15 bg-gray-300 rounded-lg shadow-md text-gray-950"
                  style={{
                    minWidth: 'calc(100% - 16px)', // Subtract gap space
                  }}
                >
                  <h3 className="font-semibold text-xl">{meal.title}</h3>
                  <p className="mt-2 text-gray-700">{meal.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
