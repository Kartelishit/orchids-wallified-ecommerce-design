import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div>
                <Link href="/" className="mb-6 flex items-center">
                  <img 
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/9d2919b8-9e68-4c70-9a71-6175f2e26831/Gemini_Generated_Image_rmm9rsrmm9rsrmm9-removebg-preview-1767885732389.png?width=8000&height=8000&resize=contain" 
                    alt="WALLIFIED" 
                    className="h-12 w-auto object-contain transition-all duration-300 hover:scale-105"
                  />
                </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Premium posters for the modern walls. Build a space that truly reflects your identity with our high-quality prints.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              {["Shop All", "New Arrivals", "Best Selling", "Custom Posters", "Poster Kits"].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(/\s+/g, "-")}`} className="text-gray-400 hover:text-[#FF0000] transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Policies</h4>
            <ul className="flex flex-col gap-4">
              {["Shipping Policy", "Refund & Replacement", "Privacy Policy", "Terms of Service"].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(/\s+/g, "-")}`} className="text-gray-400 hover:text-[#FF0000] transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Contact Info</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li>Email: support@wallified.com</li>
              <li>WhatsApp: +91 98765 43210</li>
              <li>Hours: Mon - Sat | 10AM - 7PM</li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} WALLIFIED. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Instagram</Link>
            <Link href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Twitter</Link>
            <Link href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Pinterest</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
