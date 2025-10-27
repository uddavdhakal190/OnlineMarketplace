import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { 
  Search, 
  ArrowRight, 
  Star, 
  Shield, 
  Truck, 
  CreditCard,
  TrendingUp,
  Users,
  Package
} from 'lucide-react'
import { productsAPI } from '../utils/api'
import { formatCurrency, formatRelativeTime } from '../utils/helpers'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch featured products
  const { data: featuredProducts, isLoading: featuredLoading } = useQuery(
    'featured-products',
    () => productsAPI.getProducts({ limit: 8, sortBy: 'viewCount', sortOrder: 'desc' }),
    {
      select: (response) => response.data.products
    }
  )

  // Fetch latest products
  const { data: latestProducts, isLoading: latestLoading } = useQuery(
    'latest-products',
    () => productsAPI.getProducts({ limit: 8 }),
    {
      select: (response) => response.data.products
    }
  )

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const categories = [
    { name: 'Electronics', icon: '📱', count: '1,234' },
    { name: 'Fashion', icon: '👕', count: '856' },
    { name: 'Home & Garden', icon: '🏠', count: '642' },
    { name: 'Sports & Outdoors', icon: '⚽', count: '423' },
    { name: 'Books & Media', icon: '📚', count: '312' },
    { name: 'Toys & Games', icon: '🎮', count: '198' },
    { name: 'Health & Beauty', icon: '💄', count: '156' },
    { name: 'Automotive', icon: '🚗', count: '89' }
  ]

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with buyer protection'
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: 'Fast Shipping',
      description: 'Quick and reliable shipping from verified sellers'
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Easy Checkout',
      description: 'Simple and secure checkout process with multiple payment options'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Community Driven',
      description: 'Connect with local sellers and buyers in your community'
    }
  ]

  const stats = [
    { label: 'Active Products', value: '10,000+', icon: <Package className="h-5 w-5" /> },
    { label: 'Happy Customers', value: '50,000+', icon: <Users className="h-5 w-5" /> },
    { label: 'Successful Sales', value: '100,000+', icon: <TrendingUp className="h-5 w-5" /> }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Buy & Sell New Products
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover amazing new products from verified sellers in your community. 
              Safe, secure, and simple.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-lg text-gray-900 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Search className="h-6 w-6" />
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Browse Products
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-full text-primary-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group-hover:border-primary-300">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} items</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600">Most popular items this week</p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {featuredLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Products</h2>
              <p className="text-lg text-gray-600">Fresh items just added</p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {latestLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Mart?</h2>
            <p className="text-lg text-gray-600">We make buying and selling simple and secure</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-full text-primary-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Buying or Selling?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied customers who trust Mart for their marketplace needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Get Started Today
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Product Card Component
const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product._id}`}>
      <Card className="group hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
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
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">4.8</span>
            </div>
            <span className="ml-2 text-sm text-gray-500">
              by {product.seller?.name}
            </span>
          </div>
        </Card.Content>
      </Card>
    </Link>
  )
}

export default Home
