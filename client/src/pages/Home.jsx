import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import { 
  Search, 
  ArrowRight, 
  MessageCircle,
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
  const { user } = useAuth()
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
    { name: 'Sports & Outdoors', icon: '⚽', count: '423' },
    { name: 'Books & Media', icon: '📚', count: '312' },
    { name: 'Toys & Games', icon: '🎮', count: '198' },
    { name: 'Health & Beauty', icon: '💄', count: '156' }
  ]

  const features = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'Direct Contact',
      description: 'Contact sellers directly via email or phone to discuss products'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Finland Marketplace',
      description: 'Connect with sellers and buyers across Finland'
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: 'New Products Only',
      description: 'All products are brand new, ensuring quality and value'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Community Driven',
      description: 'A simple marketplace for the community, by the community'
    }
  ]

  const stats = [
    { label: 'Active Products', value: '1,000', icon: <Package className="h-5 w-5" /> },
    { label: 'Happy Customers', value: '5,000', icon: <Users className="h-5 w-5" /> },
    { label: 'Successful Sales', value: '10,000', icon: <TrendingUp className="h-5 w-5" /> }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Buy & Sell New Products
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover amazing new products from verified sellers across Finland. 
              Safe, secure, and simple.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
              <div className="relative shadow-2xl">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-5 text-lg rounded-xl text-gray-900 focus:ring-4 focus:ring-blue-300 focus:outline-none shadow-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Search className="h-6 w-6" />
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Browse Products
                </Button>
              </Link>
              <Link to={user ? "/create-product" : "/register"}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl text-blue-600 shadow-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-gray-600 text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Find exactly what you're looking for from our curated selection</p>
          </div>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group"
                >
                  <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer group-hover:border-blue-400 group-hover:-translate-y-1 bg-white">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{category.count} items</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600">Most popular items this week</p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="flex items-center hover:bg-blue-50 transition-colors">
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
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Products</h2>
              <p className="text-lg text-gray-600">Fresh items just added</p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="flex items-center hover:bg-blue-50 transition-colors">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose O Mart?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We make buying and selling simple and secure</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl text-blue-600 shadow-lg">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to Start Buying or Selling?
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust O Mart for their marketplace needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8">
                Get Started Today
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8">
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
      <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-blue-200 transform hover:-translate-y-2 bg-white">
        <div className="aspect-w-16 aspect-h-12 bg-gray-200 overflow-hidden">
          <img
            src={product.images?.[0]?.url || '/placeholder-product.jpg'}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <Card.Content className="p-5">
          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors text-lg">
            {product.title}
          </h3>
          <p className="text-2xl font-bold text-blue-600 mb-3">
            {formatCurrency(product.price)}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">{product.category}</span>
            <span>{formatRelativeTime(product.createdAt)}</span>
          </div>
          <div className="pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-600 font-medium">
              by {product.seller?.name}
            </span>
          </div>
        </Card.Content>
      </Card>
    </Link>
  )
}

export default Home
