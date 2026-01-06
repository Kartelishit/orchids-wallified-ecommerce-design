"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Search, User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const shopPosters = [
  "All Posters", "New Arrivals", "Best Selling", "Anime", "Movies", 
  "TV Series", "Music", "Sports", "Motivational", "Aesthetic", "Devotional"
]

const multiCollections = [
  "3-Poster Collections", "Split Posters", "Wall Kits", 
  "50–60 Poster Kits", "Room Makeover Sets", "Trending Collections"
]

const helpCenter = [
  { name: "Shipping Policy", href: "/policies/shipping" },
  { name: "Refund & Replacement Policy", href: "/policies/refund" },
  { name: "FAQ", href: "/policies/faq" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(2) // Mock cart count

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center px-6 md:px-12",
        isScrolled ? "bg-white shadow-sm border-b" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter text-black flex items-center gap-1">
          <span className="text-brand-red">WALL</span>IFIED
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {/* Shop Posters */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent data-[state=open]:bg-transparent group h-auto py-2">
                  <span className="relative pb-1 font-bold uppercase tracking-tight text-sm">
                    Shop Posters
                    <motion.div className="absolute bottom-0 left-0 h-[2px] bg-brand-red w-0 group-hover:w-full transition-all duration-300" />
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
                    {shopPosters.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block select-none space-y-1 rounded-none p-3 leading-none no-underline outline-none transition-colors hover:bg-brand-gray hover:text-brand-red font-bold uppercase text-xs tracking-widest"
                          >
                            {item}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Multi Poster Collections */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent data-[state=open]:bg-transparent group h-auto py-2">
                  <span className="relative pb-1 font-bold uppercase tracking-tight text-sm">
                    Collections
                    <motion.div className="absolute bottom-0 left-0 h-[2px] bg-brand-red w-0 group-hover:w-full transition-all duration-300" />
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
                    {multiCollections.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/collection/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block select-none space-y-1 rounded-none p-3 leading-none no-underline outline-none transition-colors hover:bg-brand-gray hover:text-brand-red font-bold uppercase text-xs tracking-widest"
                          >
                            {item}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Custom Posters */}
              <NavigationMenuItem>
                <Link href="/custom" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-transparent group h-auto py-2 px-4")}>
                    <span className="relative pb-1 font-bold uppercase tracking-tight text-sm">
                      Custom
                      <motion.div className="absolute bottom-0 left-0 h-[2px] bg-brand-red w-0 group-hover:w-full transition-all duration-300" />
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* Help Center */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent data-[state=open]:bg-transparent group h-auto py-2">
                  <span className="relative pb-1 font-bold uppercase tracking-tight text-sm">
                    Help
                    <motion.div className="absolute bottom-0 left-0 h-[2px] bg-brand-red w-0 group-hover:w-full transition-all duration-300" />
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-[250px] gap-3 p-4 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
                    {helpCenter.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-none p-3 leading-none no-underline outline-none transition-colors hover:bg-brand-gray hover:text-brand-red font-bold uppercase text-xs tracking-widest"
                          >
                            {item.name}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:text-brand-red transition-colors">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-brand-red transition-colors">
            <User className="w-5 h-5" />
          </Button>
          <Link href="/cart" className="relative group p-2">
            <ShoppingCart className="w-5 h-5 group-hover:text-brand-red transition-colors" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute top-0 right-0"
            >
              <Badge className="bg-brand-red text-white border-none min-w-[1.2rem] h-[1.2rem] flex items-center justify-center p-0 text-[10px] rounded-full font-bold">
                {cartCount}
              </Badge>
            </motion.div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 bg-white z-[60] lg:hidden p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <Link href="/" className="text-2xl font-black tracking-tighter text-black" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="text-brand-red">WALL</span>IFIED
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <nav className="flex flex-col gap-8">
              <Link href="/category/all" className="text-4xl font-black uppercase tracking-tighter hover:text-brand-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Shop Posters</Link>
              <Link href="/collection/all" className="text-4xl font-black uppercase tracking-tighter hover:text-brand-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
              <Link href="/custom" className="text-4xl font-black uppercase tracking-tighter hover:text-brand-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Custom</Link>
              <Link href="/policies/faq" className="text-4xl font-black uppercase tracking-tighter hover:text-brand-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Help</Link>
              <Link href="/contact" className="text-4xl font-black uppercase tracking-tighter hover:text-brand-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
