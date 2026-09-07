// import React from 'react'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import { ProtectedRoute } from './components/ProtectedRoute.jsx'
// import Login from './pages/Login.jsx'
// import Dashboard from './pages/Dashboard.jsx'
// import Schedule from './pages/Schedule.jsx'
// import Runs from './pages/Runs.jsx'
// import Staff from './pages/Staff.jsx'
// import Depots from './pages/Depots.jsx'
// import Reports from './pages/Reports.jsx'
// import Earnings from './pages/Earnings.jsx'
// import Admin from './pages/Admin.jsx'
// import NotFound from './pages/NotFound.jsx'

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/dashboard" replace />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//       <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
//       <Route path="/runs" element={<ProtectedRoute><Runs /></ProtectedRoute>} />
//       <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
//       <Route path="/depots" element={<ProtectedRoute><Depots /></ProtectedRoute>} />
//       <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
//       <Route path="/earnings" element={<ProtectedRoute adminOnly><Earnings /></ProtectedRoute>} />
//       <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   )
// }
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Schedule from './pages/Schedule.jsx'
import Runs from './pages/Runs.jsx'
import Staff from './pages/Staff.jsx'
import Depots from './pages/Depots.jsx'
import Reports from './pages/Reports.jsx'
import Earnings from './pages/Earnings.jsx'
import DeletedRuns from './pages/DeletedRuns.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
      <Route path="/runs" element={<ProtectedRoute><Runs /></ProtectedRoute>} />
      <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
      <Route path="/depots" element={<ProtectedRoute><Depots /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/earnings" element={<ProtectedRoute adminOnly><Earnings /></ProtectedRoute>} />
      <Route path="/deleted-runs" element={<ProtectedRoute adminOnly><DeletedRuns /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}