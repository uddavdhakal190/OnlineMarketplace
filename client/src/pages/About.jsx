import Card from '../components/ui/Card'
import { Users, Package, Shield, Heart } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">O</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">Mart</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About O Mart</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A simple, community-driven marketplace for buying and selling new products in Finland
          </p>
        </div>

        {/* Mission */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O Mart was created with a simple goal: to provide a clean, easy-to-use platform where people in Finland can buy and sell new products directly with each other. We believe in fostering a community where trust, transparency, and simplicity come first.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Unlike traditional marketplaces, we focus on new products only, ensuring quality and value for both buyers and sellers. Our platform eliminates unnecessary complexity, allowing you to connect directly with sellers and make informed purchasing decisions.
          </p>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Community First</h3>
            </div>
            <p className="text-gray-600">
              Built for the community, by the community. We prioritize user experience and simplicity over complex features.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">New Products Only</h3>
            </div>
            <p className="text-gray-600">
              All products on our platform are brand new, ensuring quality and value for every purchase.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Verified Sellers</h3>
            </div>
            <p className="text-gray-600">
              All sellers are verified, and products go through an approval process to maintain quality standards.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Direct Contact</h3>
            </div>
            <p className="text-gray-600">
              Connect directly with sellers via email or phone. No intermediaries, just honest communication.
            </p>
          </Card>
        </div>

        {/* Values */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Simplicity</h3>
              <p className="text-gray-600">
                We believe in keeping things simple. No complicated payment systems, no unnecessary features—just a straightforward way to buy and sell.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust</h3>
              <p className="text-gray-600">
                Trust is the foundation of our community. We verify sellers and review products to ensure a safe marketplace for everyone.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">
                Clear communication between buyers and sellers is essential. We provide all the information you need to make informed decisions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                O Mart is more than just a marketplace—it's a community of people helping each other find great products and make connections.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Ready to join our community?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Get Started
            </a>
            <a
              href="/products"
              className="inline-block px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Browse Products
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

