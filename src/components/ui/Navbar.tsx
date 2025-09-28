"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { getCart } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShoppingCart, Search, User } from "lucide-react"
import { ThemeToggle } from "./theme-toggler"
import { AuthDialog } from "@/components/auth-dialog"


export function Navbar() {
  const { data: session } = useSession()
  const [count, setCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()

  useEffect(() => {
    const sync = () => {
      const items = getCart()
      setCount(items.reduce((n, i) => n + (i.qty || 1), 0))
    }
    sync()
    const onStorage = () => sync()
    const onCartUpdated = () => sync()
    window.addEventListener("storage", onStorage)
    window.addEventListener("v0-cart-updated", onCartUpdated as EventListener)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("v0-cart-updated", onCartUpdated as EventListener)
    }
  }, [])

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }
    try {
      const response = await fetch("/api/products")
      const products = await response.json()
      const filtered = products
        .filter((product: any) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.brand?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
      setSuggestions(filtered)
    } catch (error) {
      setSuggestions([])
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [suggestions])

  // Scroll detection for navbar visibility
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollPos = window.scrollY
          const isScrollingDown = currentScrollPos > prevScrollPos

          setIsVisible(currentScrollPos < 100 ? true : !isScrollingDown)
          setPrevScrollPos(currentScrollPos)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [prevScrollPos])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-lg transition-transform duration-300 shadow-sm ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Go to homepage">
            <img
              src="/store-logo.jpg?height=28&width=28&query=store-logo"
              alt="Store logo"
              className="h-7 w-7 rounded"
            />
            <span className="font-semibold text-foreground">Electronic</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/category/laptops" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Laptops
            </Link>
            <Link href="/category/desktops" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Desktops
            </Link>
            <Link href="/category/monitors" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Monitors
            </Link>
            <Link href="/category/keyboards" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Keyboards
            </Link>
            <Link href="/category/headphones" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Headphones
            </Link>
            <Link href="/category" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              All Categories
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center relative">
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.trim()) {
                  setShowSuggestions(false)
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                }
              }}
              className="flex items-center relative"
            >
              <Input 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                  setSelectedIndex(-1)
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => {
                  if (!showSuggestions || suggestions.length === 0) return
                  
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0)
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setSelectedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1)
                  } else if (e.key === 'Enter' && selectedIndex >= 0) {
                    e.preventDefault()
                    setShowSuggestions(false)
                    router.push(`/products/${suggestions[selectedIndex].slug}`)
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false)
                    setSelectedIndex(-1)
                  }
                }}
                placeholder="Search laptops, keyboards, monitors..." 
                className="w-80 pr-10" 
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-1 h-7 w-7 p-0 z-20"
                disabled={!searchQuery.trim()}
                onClick={(e) => e.stopPropagation()}
              >
                <Search className="h-4 w-4" />
              </Button>
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 mt-1">
                  {suggestions.map((product, index) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowSuggestions(false)
                        router.push(`/products/${product.slug}`)
                      }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 border-b dark:border-gray-600 last:border-b-0 cursor-pointer transition-colors ${
                        index === selectedIndex 
                          ? 'bg-blue-50 dark:bg-blue-900/50' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{product.category} • ₹{product.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
          <Link href="/cart" aria-label="Open cart" className="relative z-10">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <ShoppingCart className="h-4 w-4" aria-hidden />
              {/* <span className="hidden sm:inline">Cart</span> */}
              {count > 0 && (
                <span
                  aria-live="polite"
                  aria-atomic="true"
                  className="inline-flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white"
                >
                  {count}
                </span>
              )}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Button variant="ghost" className="relative p-0 h-10 w-10 rounded-full border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-9 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
                {session && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 p-0" align="end" forceMount>
              {session ? (
                <>
                  <div className="relative p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-full object-cover ring-3 ring-white dark:ring-gray-800 shadow-lg"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-3 ring-white dark:ring-gray-800 shadow-lg">
                            <User className="h-6 w-6 text-white" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div className="flex flex-col space-y-1 leading-none min-w-0 flex-1">
                        <p className="font-semibold text-base text-gray-900 dark:text-white">{session.user?.name || 'User'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {session.user?.email}
                        </p>

                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="my-0" />
                  <div className="p-2">
                    {(session.user?.role === 'admin' || session.user?.email === 'admin@electronic.com') && (
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg mb-1">
                        <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors">
                          <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                            <svg className="h-4 w-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Admin Panel</p>
                            <p className="text-xs text-muted-foreground">Manage your store</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg mb-1">
                      <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-sm">My Orders</p>
                          <p className="text-xs text-muted-foreground">Track your purchases</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg mb-1">
                      <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <svg className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Profile</p>
                          <p className="text-xs text-muted-foreground">Manage your account</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer rounded-lg flex items-center gap-3 px-3 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                      <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Sign Out</p>
                        <p className="text-xs text-muted-foreground">End your session</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </>
              ) : (
                <div className="p-4">
                  <div className="text-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">Welcome!</h3>
                    <p className="text-sm text-muted-foreground">Sign in to access your account</p>
                  </div>
                  <div className="space-y-2">
                    <DropdownMenuItem onClick={() => { setAuthMode('signin'); setShowAuthDialog(true) }} className="cursor-pointer rounded-lg">
                      <div className="flex items-center gap-3 px-2 py-2 w-full">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Sign In</p>
                          <p className="text-xs text-muted-foreground">Access your account</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setAuthMode('signup'); setShowAuthDialog(true) }} className="cursor-pointer rounded-lg">
                      <div className="flex items-center gap-3 px-2 py-2 w-full">
                        <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Sign Up</p>
                          <p className="text-xs text-muted-foreground">Create new account</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* <ThemeToggle /> */}

        </div>
      </nav>
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} mode={authMode} />
    </header>
  )
}
