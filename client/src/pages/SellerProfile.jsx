import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from 'react-query'
import toast from 'react-hot-toast'
import { usersAPI, productsAPI } from '../utils/api'
import { formatCurrency, formatRelativeTime } from '../utils/helpers'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Mail, Phone, Copy, X } from 'lucide-react'

const SellerProfile = () => {
  const { id } = useParams()
  const [showContactModal, setShowContactModal] = useState(false)

  const { data: sellerData, isLoading: sellerLoading } = useQuery(
    ['seller', id],
    () => usersAPI.getSellerProfile(id),
    {
      select: (response) => response.data,
      enabled: !!id
    }
  )

  if (sellerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!sellerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seller Not Found</h2>
          <p className="text-gray-600 mb-4">The seller you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const { seller, products, stats } = sellerData

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seller Header */}
        <Card className="p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">
                {seller.name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{seller.name}</h1>
              <p className="text-gray-600 mb-4">Verified Seller</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>{stats.totalProducts} products</span>
                <span>{stats.totalViews} total views</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => setShowContactModal(true)}
              >
                Contact Seller
              </Button>
            </div>
            
            {/* Contact Info Quick View */}
            {seller.email && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Contact Information:</p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href={`mailto:${seller.email}`}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    {seller.email}
                  </a>
                  {seller.phone && (
                    <a 
                      href={`tel:${seller.phone}`}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      {seller.phone}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Seller's Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Products by {seller.name}
          </h2>
          
          {products?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product._id} className="group hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                    <img
                      src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Card.Content>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-2xl font-bold text-primary-600 mb-2">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{product.category}</span>
                      <span>{formatRelativeTime(product.createdAt)}</span>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600">This seller hasn't listed any products yet.</p>
            </div>
          )}
        </div>
        
        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full p-6 relative">
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Contact {seller.name}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Get in touch with this seller
              </p>
              
              <div className="space-y-4">
                {/* Email */}
                {seller.email && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium text-gray-900">Email</span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(seller.email)
                          toast.success('Email copied to clipboard!')
                        }}
                        className="text-blue-600 hover:text-blue-700"
                        title="Copy email"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <a
                      href={`mailto:${seller.email}`}
                      className="text-blue-600 hover:text-blue-700 break-all"
                    >
                      {seller.email}
                    </a>
                  </div>
                )}
                
                {/* Phone */}
                {seller.phone ? (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium text-gray-900">Phone</span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(seller.phone)
                          toast.success('Phone number copied to clipboard!')
                        }}
                        className="text-green-600 hover:text-green-700"
                        title="Copy phone"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <a
                      href={`tel:${seller.phone}`}
                      className="text-green-600 hover:text-green-700"
                    >
                      {seller.phone}
                    </a>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-500 text-sm">Phone number not provided</span>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Click on email or phone to contact the seller directly
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerProfile
