import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Discover from './pages/Discover'
import Feed from './pages/Feed'
import Gigs from './pages/Gigs'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import EditProfile from './pages/EditProfile'
import ProtectedRoute from './components/ProtectedRoute'
import CompleteProfile from './pages/CompleteProfile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/gigs" element={<ProtectedRoute><Gigs /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App