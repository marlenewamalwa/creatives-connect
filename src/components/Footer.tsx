export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-8 py-8 flex flex-col md:flex-row items-center justify-between text-white/20 text-xs gap-4">
      <a href="/" className="text-base font-bold text-white/40">
        creatives<span className="text-orange-400">connect</span>
      </a>
      <span>© 2026 CreativesConnect Kenya — Made with 🧡 in Nairobi</span>
      <div className="flex gap-6">
        <a href="/discover" className="hover:text-white transition">Discover</a>
        <a href="/gigs" className="hover:text-white transition">Gigs</a>
        <a href="/feed" className="hover:text-white transition">Feed</a>
        <a href="/auth" className="hover:text-white transition">Sign up</a>
      </div>
    </footer>
  )
}