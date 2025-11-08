'use client'

import { useEffect, useState } from 'react'
import { getWishlist, removeFromWishlist, type WishlistItem, toggleWishlist } from '@/lib/wishlist'
import { addToCart } from '@/lib/cart'
import Link from 'next/link'
import ProductCard from '@/components/product-card'
import { Heart, ShoppingCart, Sparkles, TrendingUp, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [shareProduct, setShareProduct] = useState<WishlistItem | null>(null)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const router = useRouter()

  const handleCopyLink = () => {
    if (shareProduct) {
      navigator.clipboard.writeText(`${window.location.origin}/products/${shareProduct.slug}`)
      toast.success('Link copied to clipboard')
    }
  }

  useEffect(() => {
    const loadWishlist = async () => {
      const wishlist = getWishlist()
      
      try {
        const res = await fetch('/api/products')
        const products = await res.json()
        const cart = JSON.parse(localStorage.getItem('v0_cart') || '[]')
        
        const updated = wishlist.map(item => {
          const product = products.find((p: any) => p.id === item.id)
          if (product) {
            const cartQty = cart.reduce((sum: number, cartItem: any) => 
              cartItem.id === item.id ? sum + (cartItem.qty || 1) : sum, 0
            )
            return { 
              ...item, 
              description: item.description || product.description || 'High-quality product with premium features',
              quantity: Math.max(0, (product.quantity || product.stock || 0) - cartQty)
            }
          }
          return item
        })
        
        setItems(updated)
      } catch (error) {
        setItems(wishlist)
      }
      setLoading(false)
    }
    
    loadWishlist()
    const onUpdate = () => loadWishlist()
    window.addEventListener('wishlist-updated', onUpdate)
    return () => window.removeEventListener('wishlist-updated', onUpdate)
  }, [])

  if (loading) {
    return (
      <div className='bg-gray-50'>
        <div className="max-w-7xl mx-auto min-h-screen mt-5 sm:mt-2 p-4">
          <header className="mb-8 text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 sm:mt-1">Save your favorite items for later</p>
          </header>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0 sm:gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="bg-white border sm:rounded-sm animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className='bg-gray-50'>
      <div className="max-w-7xl mx-auto min-h-screen mt-5 sm:mt-2 p-4">
        <header className="mb-8 text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 sm:mt-1">Save your favorite items for later</p>
        </header>
        <div className="max-w-2xl w-full text-center mx-auto">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-red-100 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-gradient-to-br from-pink-200 to-red-200 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-pink-500" strokeWidth={1.5} />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Your Wishlist is Empty</h1>
          <p className="text-sm sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-md mx-auto">
            Start adding products you love and keep track of items you want to buy later
          </p>
          
          <Link href="/" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:from-pink-600 hover:to-red-600 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            Start Shopping
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16">
            <div className="flex flex-col items-center p-4 sm:p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Save Favorites</h3>
              <p className="text-xs sm:text-sm text-gray-600 text-center">Keep track of products you love</p>
            </div>
            
            <div className="flex flex-col items-center p-4 sm:p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Track Prices</h3>
              <p className="text-xs sm:text-sm text-gray-600 text-center">Get notified of price drops</p>
            </div>
            
            <div className="flex flex-col items-center p-4 sm:p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Easy Access</h3>
              <p className="text-xs sm:text-sm text-gray-600 text-center">Quick access to saved items</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-5 sm:mt-0">
      <div className="max-w-7xl mx-auto py-4 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-3 sm:px-4">
         <header className="text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 sm:mt-1">Save your favorite items for later</p>
        </header>
          <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors">
                <Trash className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Wishlist?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all {items.length} item{items.length !== 1 ? 's' : ''} from your wishlist. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    localStorage.removeItem('wishlist')
                    setItems([])
                    window.dispatchEvent(new Event('wishlist-updated'))
                    toast.success('Wishlist cleared')
                  }}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0 sm:gap-2">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={{
                ...item,
                coverImage: item.image,
                quantity: (item as any).quantity || 0
              }}
              onAddToCart={(e, product) => {
                e.preventDefault()
                e.stopPropagation()
                if ((item as any).quantity === 0) {
                  toast.error('Out of Stock', { description: 'This product is currently unavailable.' })
                  return
                }
                addToCart({
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: item.image,
                })
                toast.success('', { description: `${product.name} has been added to your cart.` })
              }}
              onBuyNow={(e, product) => {
                e.preventDefault()
                e.stopPropagation()
                if ((item as any).quantity === 0) {
                  toast.error('Out of Stock', { description: 'This product is currently unavailable.' })
                  return
                }
                addToCart({
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: item.image,
                })
                router.push('/cart')
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
