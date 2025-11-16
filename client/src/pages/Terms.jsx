import Card from '../components/ui/Card'
import { FileText, Shield, AlertCircle, CheckCircle } from 'lucide-react'

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">Terms of Service</span>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using O Mart
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: January 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            By accessing and using O Mart ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
          <p className="text-gray-700 leading-relaxed">
            O Mart is a community marketplace platform that facilitates direct communication between buyers and sellers in Finland. We provide the platform, but all transactions are conducted directly between users.
          </p>
        </Card>

        {/* User Responsibilities */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Responsibilities</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Account Security</h3>
                <p className="text-gray-600 text-sm">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Accurate Information</h3>
                <p className="text-gray-600 text-sm">
                  You must provide accurate, current, and complete information when creating an account or listing a product. Misleading or false information may result in account suspension.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Age Requirement</h3>
                <p className="text-gray-600 text-sm">
                  You must be at least 18 years old to use O Mart. By using the platform, you represent that you meet this age requirement.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Seller Responsibilities */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Seller Responsibilities</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Product Listings</h3>
                <p className="text-gray-600 text-sm">
                  All products must be brand new and accurately described. Sellers are responsible for providing truthful information about their products, including condition, price, and availability.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Product Approval</h3>
                <p className="text-gray-600 text-sm">
                  All product listings are subject to admin review and approval. O Mart reserves the right to reject, remove, or modify any listing that violates our policies.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Direct Communication</h3>
                <p className="text-gray-600 text-sm">
                  Sellers must respond to buyer inquiries in a timely and professional manner. All communication and transactions occur directly between buyers and sellers.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Buyer Responsibilities */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Buyer Responsibilities</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Due Diligence</h3>
                <p className="text-gray-600 text-sm">
                  Buyers are responsible for verifying product details, seller information, and making informed purchasing decisions. O Mart does not guarantee the accuracy of product listings.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Direct Transactions</h3>
                <p className="text-gray-600 text-sm">
                  All transactions are conducted directly between buyers and sellers. O Mart is not involved in the payment or delivery process and is not responsible for transaction disputes.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Respectful Communication</h3>
                <p className="text-gray-600 text-sm">
                  Buyers must communicate respectfully with sellers and honor agreements made during the purchasing process.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Prohibited Activities */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Activities</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You agree not to use O Mart to:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-red-600 mr-2">•</span>
              <span>List counterfeit, stolen, or illegal products</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-2">•</span>
              <span>Post misleading, false, or fraudulent information</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-2">•</span>
              <span>Harass, abuse, or harm other users</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-2">•</span>
              <span>Violate any applicable laws or regulations</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-2">•</span>
              <span>Attempt to gain unauthorized access to the platform</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-2">•</span>
              <span>Use automated systems to scrape or collect data</span>
            </li>
          </ul>
        </Card>

        {/* Limitation of Liability */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O Mart is a platform that facilitates connections between buyers and sellers. We are not a party to any transaction between users and are not responsible for:
          </p>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <span>The quality, safety, or legality of products listed</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <span>The accuracy of product descriptions or seller information</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <span>Payment disputes or delivery issues</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <span>Any damages resulting from transactions between users</span>
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Users are solely responsible for their interactions and transactions with other users.
          </p>
        </Card>

        {/* Account Termination */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Account Termination</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O Mart reserves the right to suspend or terminate your account at any time, with or without notice, for any violation of these Terms of Service or for any other reason we deem necessary to protect the integrity of our platform.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You may also terminate your account at any time by contacting us at <a href="mailto:support@omart.fi" className="text-blue-600 hover:underline">support@omart.fi</a>.
          </p>
        </Card>

        {/* Changes to Terms */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify these Terms of Service at any time. We will notify users of any significant changes by posting the updated terms on this page. Your continued use of O Mart after such modifications constitutes acceptance of the updated terms.
          </p>
        </Card>

        {/* Contact */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Email:</strong> <a href="mailto:support@omart.fi" className="text-blue-600 hover:underline">support@omart.fi</a>
            </p>
            <p>
              <strong>Phone:</strong> <a href="tel:+35891234567" className="text-blue-600 hover:underline">+358 9 123 4567</a>
            </p>
            <p>
              <strong>Location:</strong> Helsinki, Finland
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Terms

