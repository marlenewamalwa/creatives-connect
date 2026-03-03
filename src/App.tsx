import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Discover from './pages/Discover'
import Feed from './pages/Feed'
import Gigs from './pages/Gigs'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/gigs" element={<Gigs />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App