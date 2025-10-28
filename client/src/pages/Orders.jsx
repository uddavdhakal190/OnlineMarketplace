import { useState } from 'react'
import { useQuery } from 'react-query'
import { paymentsAPI } from '../utils/api'
import { formatCurrency, formatDate, getOrderStatusColor } from '../utils/helpers'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const Orders = () => {
  const [orderType, setOrderType] = useState('all')

  const { data, isLoading } = useQuery(
    ['orders', orderType],
    () => paymentsAPI.getOrders({ type: orderType }),
    {
      select: (response) => response.data
    }
  )

  const orderTypes = [
    { value: 'all', label: 'All Orders' },
    { value: 'bought', label: 'Orders I Bought' },
    { value: 'sold', label: 'Orders I Sold' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Track your orders and sales</p>
        </div>

        {/* Order Type Filter */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {orderTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setOrderType(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  orderType === type.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : data?.orders?.length > 0 ? (
          <div className="space-y-4">
            {data.orders.map((order) => (
              <Card key={order._id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderId}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Product</p>
                    <p className="font-medium text-gray-900">{order.product?.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium text-gray-900">{formatCurrency(order.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {orderType === 'bought' ? 'Seller' : 'Buyer'}
                    </p>
                    <p className="font-medium text-gray-900">
                      {orderType === 'bought' ? order.seller?.name : order.buyer?.name}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {order.status === 'pending' && orderType === 'sold' && (
                    <Button size="sm">
                      Update Status
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {orderType === 'all' 
                ? "You don't have any orders yet." 
                : `No ${orderType} orders found.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
