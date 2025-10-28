import { useState } from 'react'
import { useQuery } from 'react-query'
import { adminAPI } from '../../utils/api'
import { formatCurrency, formatRelativeTime, getStatusColor } from '../../utils/helpers'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { Check, X, Trash2, Eye } from 'lucide-react'

const AdminProducts = () => {
  const [statusFilter, setStatusFilter] = useState('all')

  const { data, isLoading, refetch } = useQuery(
    ['admin-products', statusFilter],
    () => adminAPI.getProducts({ 
      status: statusFilter === 'all' ? undefined : statusFilter 
    }),
    {
      select: (response) => response.data
    }
  )

  const statusOptions = [
    { value: 'all', label: 'All Products' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'sold', label: 'Sold' }
  ]

  const handleApprove = async (productId) => {
    try {
      await adminAPI.approveProduct(productId)
      refetch()
    } catch (error) {
      console.error('Error approving product:', error)
    }
  }

  const handleReject = async (productId) => {
    const reason = prompt('Reason for rejection:')
    if (reason) {
      try {
        await adminAPI.rejectProduct(productId, reason)
        refetch()
      } catch (error) {
        console.error('Error rejecting product:', error)
      }
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(productId)
        refetch()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage all products in the marketplace</p>
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

        {/* Products Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : data?.products?.length > 0 ? (
          <div className="space-y-4">
            {data.products.map((product) => (
              <Card key={product._id} className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatCurrency(product.price)}</span>
                          <span>{product.category}</span>
                          <span>by {product.seller?.name}</span>
                          <span>{formatRelativeTime(product.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/products/${product._id}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      
                      {product.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(product._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(product._id)}
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? "No products in the marketplace yet." 
                : `No products with status "${statusFilter}" found.`
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

export default AdminProducts
