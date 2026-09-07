import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-6 text-center">
      <div>
        <p className="font-display text-6xl font-semibold text-route-500">404</p>
        <p className="mt-2 text-[14px] text-ash-600">That page doesn't exist.</p>
        <Link to="/dashboard" className="btn-primary mt-5 inline-flex">Back to dashboard</Link>
      </div>
    </div>
  )
}
