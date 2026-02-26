import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-8xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mt-4">Page Not Found</h2>
      <p className="text-gray-400 mt-2">The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition"
      >
        Go Back Home
      </button>
    </div>
  )
}

export default NotFound