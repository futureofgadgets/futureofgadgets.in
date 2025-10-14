const WISHLIST_KEY = 'wishlist'

export type WishlistItem = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  description: string
}

export function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(WISHLIST_KEY)
  return data ? JSON.parse(data) : []
}

export function addToWishlist(item: WishlistItem) {
  const wishlist = getWishlist()
  if (!wishlist.find(i => i.id === item.id)) {
    wishlist.push(item)
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
    window.dispatchEvent(new Event('wishlist-updated'))
  }
}

export function removeFromWishlist(id: string) {
  const wishlist = getWishlist().filter(i => i.id !== id)
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  window.dispatchEvent(new Event('wishlist-updated'))
}

export function isInWishlist(id: string): boolean {
  return getWishlist().some(i => i.id === id)
}

export function toggleWishlist(item: WishlistItem): boolean {
  if (isInWishlist(item.id)) {
    removeFromWishlist(item.id)
    return false
  } else {
    addToWishlist(item)
    return true
  }
}
