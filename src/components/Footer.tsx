import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-8 py-8 flex flex-col md:flex-row items-center justify-between text-white/20 text-xs gap-4">
      <Link to="/" className="text-base font-bold text-white/40">
        creatives<span className="text-orange-400">connect</span>
      </Link>
      <span>© 2026 CreativesConnect Kenya </span>
      <div className="flex gap-6">
        <Link to="/discover" className="hover:text-white transition">Discover</Link>
        <Link to="/gigs" className="hover:text-white transition">Gigs</Link>
        <Link to="/feed" className="hover:text-white transition">Feed</Link>
        <Link to="/auth" className="hover:text-white transition">Sign up</Link>
      </div>
    </footer>
  )
}