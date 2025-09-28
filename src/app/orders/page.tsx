'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react'

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin?callbackUrl=/orders')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) return null

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      total: 1299,
      status: 'Delivered',
      items: [
        { name: 'Wireless Headphones', price: 799, qty: 1 },
        { name: 'Phone Case', price: 500, qty: 1 }
      ],
      address: '123 Main St, City, State 12345',
      trackingId: 'TRK123456789'
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      total: 899,
      status: 'Shipped',
      items: [
        { name: 'Bluetooth Speaker', price: 899, qty: 1 }
      ],
      address: '123 Main St, City, State 12345',
      trackingId: 'TRK987654321'
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      total: 2499,
      status: 'Processing',
      items: [
        { name: 'Gaming Laptop', price: 1999, qty: 1 },
        { name: 'Wireless Mouse', price: 500, qty: 1 }
      ],
      address: '123 Main St, City, State 12345',
      trackingId: null
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'Shipped':
        return <Truck className="h-5 w-5 text-blue-600" />
      case 'Processing':
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <Package className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Shipped':
        return 'bg-blue-100 text-blue-800'
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order {order.id}</h3>
                    <p className="text-sm text-gray-500">Placed on {order.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Items Ordered</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.name} × {item.qty}</span>
                          <span className="font-medium">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Delivery Details</h4>
                    <p className="text-sm text-gray-600 mb-2">{order.address}</p>
                    {order.trackingId && (
                      <p className="text-sm text-gray-600">
                        Tracking ID: <span className="font-mono">{order.trackingId}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  {order.trackingId && (
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                      <Truck className="h-4 w-4" />
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600">Start shopping to see your orders here</p>
          </div>
        )}
      </div>
    </div>
  )
}