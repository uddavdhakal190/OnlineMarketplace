import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import { Plus, Edit, Trash2, Eye, MoreVertical, CheckCircle } from 'lucide-react'
import { usersAPI, productsAPI } from '../utils/api'
import { formatCurrency, formatRelativeTime, getStatusColor } from '../utils/helpers'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const MyProducts = () => {
  const [statusFilter, setStatusFilter] = useState('all')
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery(
    ['my-products', statusFilter],
    () => usersAPI.getMyProducts({ 
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

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(productId)
        toast.success('Product deleted successfully')
        refetch()
        queryClient.invalidateQueries(['my-products'])
      } catch (error) {
        console.error('Error deleting product:', error)
        toast.error(error.response?.data?.message || 'Failed to delete product')
      }
    }
  }

  const handleMarkAsSold = async (productId) => {
    if (window.confirm('Mark this product as sold? This will make it unavailable for purchase.')) {
      try {
        await productsAPI.markAsSold(productId)
        toast.success('Product marked as sold successfully')
        refetch()
        queryClient.invalidateQueries(['my-products'])
        queryClient.invalidateQueries(['products'])
      } catch (error) {
        console.error('Error marking product as sold:', error)
        toast.error(error.response?.data?.message || 'Failed to mark product as sold')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
            <p className="text-gray-600">Manage your product listings</p>
          </div>
          <Link to="/create-product">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : data?.products?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.products.map((product) => (
              <Card key={product._id} className="group hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-t-lg overflow-hidden">
                  <img
                    src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <Card.Content>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {product.title}
                    </h3>
                    <div className="relative">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-2xl font-bold text-primary-600 mb-3">
                    {formatCurrency(product.price)}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatRelativeTime(product.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{product.category}</span>
                    <span>{product.viewCount} views</span>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <Link to={`/products/${product._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      {product.status !== 'sold' && (
                        <Link to={`/edit-product/${product._id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {product.status !== 'sold' && product.status === 'approved' && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsSold(product._id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Sold
                      </Button>
                    )}
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {statusFilter === 'all' 
                ? "You haven't created any products yet." 
                : `No products with status "${statusFilter}" found.`
              }
            </p>
            <Link to="/create-product">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Product
              </Button>
            </Link>
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

export default MyProducts
