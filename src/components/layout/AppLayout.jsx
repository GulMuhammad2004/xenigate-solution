import React from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

export default function AppLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-route-700">
      <Sidebar />
      <div className="md:pl-[248px]">
        <Topbar title={title} subtitle={subtitle} />
        <main className="px-5 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  )
}
