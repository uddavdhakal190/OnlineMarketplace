import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  MessageCircle,
  Mail,
  Phone,
  Copy,
  X
} from 'lucide-react'
import { productsAPI } from '../utils/api'
import { formatCurrency, formatRelativeTime } from '../utils/helpers'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const ProductDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [showContactModal, setShowContactModal] = useState(false)

  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    () => productsAPI.getProduct(id),
    {
      select: (response) => response.data,
      enabled: !!id
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/products" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                alt={product.title}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`${product.title} ${index + 2}`}
                    className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-2xl font-bold text-primary-600 mb-4">
                {formatCurrency(product.price)}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{product.location?.city || 'Unknown Location'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Posted {formatRelativeTime(product.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Category</h4>
              <p className="text-gray-600">{product.category}</p>
            </div>

            {/* Seller Info */}
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {product.seller?.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{product.seller?.name}</h4>
                  <p className="text-sm text-gray-500">Verified Seller</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setShowContactModal(true)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
                <Link to={`/seller/${product.seller?._id}`}>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                </Link>
              </div>
              
              {/* Contact Info Display */}
              {product.seller?.email && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Contact Information:</p>
                  <div className="space-y-1">
                    <a 
                      href={`mailto:${product.seller.email}?subject=Inquiry about ${product.title}`}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Mail className="h-3 w-3 mr-2" />
                      {product.seller.email}
                    </a>
                    {product.seller?.phone && (
                      <a 
                        href={`tel:${product.seller.phone}`}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Phone className="h-3 w-3 mr-2" />
                        {product.seller.phone}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {user?.role !== 'admin' ? (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowContactModal(true)}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact Seller to Buy
                </Button>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 text-center">
                    Admin accounts cannot purchase products. Admin role is for management only.
                  </p>
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
                    Contact {product.seller?.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Get in touch with the seller to purchase <strong>{product.title}</strong>
                  </p>
                  
                  <div className="space-y-4">
                    {/* Email */}
                    {product.seller?.email && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="font-medium text-gray-900">Email</span>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(product.seller.email)
                              toast.success('Email copied to clipboard!')
                            }}
                            className="text-blue-600 hover:text-blue-700"
                            title="Copy email"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <a
                          href={`mailto:${product.seller.email}?subject=Inquiry about ${product.title}&body=Hi, I'm interested in purchasing ${product.title} for ${formatCurrency(product.price)}.`}
                          className="text-blue-600 hover:text-blue-700 break-all"
                        >
                          {product.seller.email}
                        </a>
                      </div>
                    )}
                    
                    {/* Phone */}
                    {product.seller?.phone ? (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 text-green-600 mr-2" />
                            <span className="font-medium text-gray-900">Phone</span>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(product.seller.phone)
                              toast.success('Phone number copied to clipboard!')
                            }}
                            className="text-green-600 hover:text-green-700"
                            title="Copy phone"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <a
                          href={`tel:${product.seller.phone}`}
                          className="text-green-600 hover:text-green-700"
                        >
                          {product.seller.phone}
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
      </div>
    </div>
  )
}

export default ProductDetail
