import Card from '../components/ui/Card'
import { Shield, Lock, Eye, FileText } from 'lucide-react'

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600">
            Last updated: January 2025
          </p>
        </div>

        <Card className="p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At O Mart, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our marketplace platform. Please read this policy carefully to understand our practices regarding your personal data.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By using O Mart, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
          </p>
        </Card>

        <Card className="p-8 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
              <p className="text-gray-700 leading-relaxed">
                When you register for an account, we collect information such as your name, email address, phone number (optional), and address. This information is necessary to create and manage your account and to facilitate communication between buyers and sellers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Information</h3>
              <p className="text-gray-700 leading-relaxed">
                When you list a product, we collect information about the product including title, description, price, images, and location. This information is displayed publicly on our platform to help buyers find products.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Data</h3>
              <p className="text-gray-700 leading-relaxed">
                We automatically collect certain information when you use our platform, including your IP address, browser type, device information, and pages you visit. This helps us improve our service and ensure security.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
          </div>
          
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>To create and manage your account</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>To display your product listings to potential buyers</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>To facilitate communication between buyers and sellers (email and phone are shared only when you choose to contact a seller)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>To review and approve product listings (admin access only)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>To improve our platform and user experience</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>To send you important updates about your account or our service</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>To ensure platform security and prevent fraud</span>
            </li>
          </ul>
        </Card>

        <Card className="p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We respect your privacy and do not sell your personal information to third parties. We only share your information in the following circumstances:
          </p>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">With Other Users</h3>
              <p className="text-gray-700 text-sm">
                When you contact a seller or when a buyer contacts you, your email and phone number (if provided) are shared to facilitate direct communication. This is essential for the marketplace to function.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">With Service Providers</h3>
              <p className="text-gray-700 text-sm">
                We may share information with trusted service providers who help us operate our platform (e.g., cloud storage, email services). These providers are bound by confidentiality agreements.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Legal Requirements</h3>
              <p className="text-gray-700 text-sm">
                We may disclose information if required by law or to protect the rights, property, or safety of O Mart, our users, or others.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Encryption of sensitive data</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Secure password storage using industry-standard hashing</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Regular security audits and updates</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Access controls and authentication</span>
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
          </p>
        </Card>

        <Card className="p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You have the following rights regarding your personal information:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Access:</strong> You can view and update your personal information in your profile settings</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Deletion:</strong> You can request deletion of your account and associated data by contacting us</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Correction:</strong> You can update your information at any time through your account settings</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Opt-out:</strong> You can choose not to provide optional information such as phone number</span>
            </li>
          </ul>
        </Card>

        <Card className="p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, and maintain your login session. You can control cookies through your browser settings, though this may affect some functionality of our platform.
          </p>
        </Card>

        <Card className="p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            O Mart is not intended for users under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. You are advised to review this policy periodically for any changes.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@omart.fi" className="text-blue-600 hover:underline">support@omart.fi</a>.
          </p>
        </Card>
      </div>
    </div>
  )
}

export default Privacy

