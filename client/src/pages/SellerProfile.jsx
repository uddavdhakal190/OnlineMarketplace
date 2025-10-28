import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { usersAPI, productsAPI } from '../utils/api'
import { formatCurrency, formatRelativeTime } from '../utils/helpers'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const SellerProfile = () => {
  const { id } = useParams()

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
                <span>Member since {new Date(seller.createdAt).getFullYear()}</span>
                <span>{stats.totalProducts} products</span>
                <span>{stats.totalViews} total views</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                Contact Seller
              </Button>
              <Button>
                Follow
              </Button>
            </div>
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
      </div>
    </div>
  )
}

export default SellerProfile
