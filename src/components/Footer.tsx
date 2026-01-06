import Link from "next/link"
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <Link href="/" className="text-3xl font-black tracking-tighter flex items-center gap-1">
            <span className="text-brand-red">WALL</span>IFIED
          </Link>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            Premium quality posters designed to make your walls speak. Bold, vibrant, and uniquely you.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-brand-red transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-brand-red transition-colors">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-brand-red transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6 uppercase tracking-tighter">Quick Links</h4>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li><Link href="/category/all" className="hover:text-brand-red transition-colors">Shop All Posters</Link></li>
            <li><Link href="/collection/all" className="hover:text-brand-red transition-colors">Featured Collections</Link></li>
            <li><Link href="/custom" className="hover:text-brand-red transition-colors">Custom Posters</Link></li>
            <li><Link href="/contact" className="hover:text-brand-red transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="text-lg font-bold mb-6 uppercase tracking-tighter">Policies</h4>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li><Link href="/policies/shipping" className="hover:text-brand-red transition-colors">Shipping Policy</Link></li>
            <li><Link href="/policies/refund" className="hover:text-brand-red transition-colors">Refund & Replacement</Link></li>
            <li><Link href="/policies/privacy" className="hover:text-brand-red transition-colors">Privacy Policy</Link></li>
            <li><Link href="/policies/faq" className="hover:text-brand-red transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold mb-6 uppercase tracking-tighter">Contact</h4>
          <div className="flex items-start gap-3 text-sm text-zinc-400">
            <Mail className="w-5 h-5 text-brand-red shrink-0" />
            <span>support@wallified.in</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-zinc-400">
            <Phone className="w-5 h-5 text-brand-red shrink-0" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-zinc-400">
            <MapPin className="w-5 h-5 text-brand-red shrink-0" />
            <span>Mumbai, Maharashtra, India</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} WALLIFIED. All rights reserved.
        </p>
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
          Made with ❤️ in India
        </p>
      </div>
    </footer>
  )
}
