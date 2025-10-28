import { useState } from 'react'
import { useQuery } from 'react-query'
import { adminAPI } from '../../utils/api'
import { formatCurrency, formatDate, getOrderStatusColor } from '../../utils/helpers'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { Package, User, Calendar, DollarSign } from 'lucide-react'

const AdminOrders = () => {
  const [statusFilter, setStatusFilter] = useState('all')

  const { data, isLoading } = useQuery(
    ['admin-orders', statusFilter],
    () => adminAPI.getOrders({ 
      status: statusFilter === 'all' ? undefined : statusFilter 
    }),
    {
      select: (response) => response.data
    }
  )

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage all orders in the marketplace</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === option.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
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
                <div className="flex items-start justify-between mb-4">
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
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Product</p>
                      <p className="font-medium text-gray-900">{order.product?.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Buyer</p>
                      <p className="font-medium text-gray-900">{order.buyer?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium text-gray-900">{formatCurrency(order.amount)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <p>Seller: {order.seller?.name}</p>
                    {order.trackingNumber && (
                      <p>Tracking: {order.trackingNumber}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {order.status === 'pending' && (
                      <Button size="sm">
                        Update Status
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? "No orders in the system yet." 
                : `No orders with status "${statusFilter}" found.`
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <Button variant="outline" disabled={!data.pagination.hasPrev}>
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {data.pagination.currentPage} of {data.pagination.totalPages}
              </span>
              <Button variant="outline" disabled={!data.pagination.hasNext}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
