"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCart, updateQty, removeFromCart, clearCart } from "@/lib/cart"
import { useSession } from "next-auth/react"
import { AuthDialog } from "@/components/auth-dialog"
import Link from "next/link"

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
        <div className="text-muted-foreground">
          Your cart is empty.{" "}
          <Link href="/products" className="underline">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-4">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-4 rounded-lg border p-3">
                <Link href={`/products/${i.slug}`} className="flex-shrink-0">
                  <img
                    src={`${i.image}?height=72&width=72&query=cart-item`}
                    alt={`${i.name} image`}
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
