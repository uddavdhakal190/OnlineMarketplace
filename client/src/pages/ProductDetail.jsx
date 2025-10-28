import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Calendar, 
  Shield, 
  Truck,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react'
import { productsAPI } from '../utils/api'
import { formatCurrency, formatRelativeTime } from '../utils/helpers'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const ProductDetail = () => {
  const { id } = useParams()

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
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span>4.8 (24 reviews)</span>
                </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Category</h4>
                <p className="text-gray-600">{product.category}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Condition</h4>
                <p className="text-gray-600">{product.condition}</p>
              </div>
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
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Link to={`/seller/${product.seller?._id}`}>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link to={`/checkout/${product._id}`}>
                <Button className="w-full" size="lg">
                  Buy Now
                </Button>
              </Link>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-1" />
                <span>Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
