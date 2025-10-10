"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

import { getCart, updateQty, removeFromCart, clearCart } from "@/lib/cart"
import { useSession } from "next-auth/react"
import { AuthDialog } from "@/components/auth-dialog"
import Link from "next/link"
import Image from "next/image"

type CartItem = ReturnType<typeof getCart>[number]

export default function CartView() {
  const { data: session } = useSession()
  const [items, setItems] = useState<CartItem[]>([])
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    setItems(getCart())
    const onStorage = () => setItems(getCart())
    const onCartUpdated = () => setItems(getCart())
    window.addEventListener("storage", onStorage)
    window.addEventListener("v0-cart-updated", onCartUpdated as EventListener)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("v0-cart-updated", onCartUpdated as EventListener)
    }
  }, [])

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * (i.qty || 1), 0), [items])

  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-2xl w-full text-center px-4">
            {/* Empty Cart Illustration */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 bg-blue-50 rounded-full"></div>
              <div className="absolute inset-8 bg-blue-100 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-24 h-24 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet. Start shopping to find amazing products!
            </p>

            {/* Action Button */}
            <Link href="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              Start Shopping
            </Link>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6 mt-16">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Free Shipping</h3>
                <p className="text-sm text-gray-600">On all orders above ₹1000</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure Payment</h3>
                <p className="text-sm text-gray-600">100% secure transactions</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Easy Returns</h3>
                <p className="text-sm text-gray-600">7-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-4">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-4 rounded-lg border p-3">
                <Link href={`/products/${i.slug}`} className="flex-shrink-0">
                  <Image
                    src={i.image}
                    alt={`${i.name} image`}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-md border object-cover hover:opacity-80 transition-opacity"
                  />
                </Link>
                <div className="flex-1">
                  <Link href={`/products/${i.slug}`} className="hover:underline">
                    <div className="font-medium text-foreground">{i.name}</div>
                  </Link>
                  <div className="text-sm text-muted-foreground">₹{i.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newQty = Math.max(1, (i.qty || 1) - 1)
                        updateQty(i.id, newQty)
                        setItems(getCart())
                      }}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      -
                    </Button>
                    <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                      {i.qty || 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newQty = (i.qty || 1) + 1
                        updateQty(i.id, newQty)
                        setItems(getCart())
                      }}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      removeFromCart(i.id)
                      setItems(getCart())
                    }}
                    aria-label={`Remove ${i.name}`}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="text-foreground">
              Total: <span className="font-semibold">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  clearCart()
                  setItems([])
                }}
              >
                Clear Cart
              </Button>
              {session ? (
                <Link href="/checkout">
                  <Button>Checkout</Button>
                </Link>
              ) : (
                <Button onClick={() => { setAuthMode('signin'); setShowAuthDialog(true) }}>
                  Checkout
                </Button>
              )}
            </div>
          </div>
        </>
      )}
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} mode={authMode} />
    </div>
  )
}
