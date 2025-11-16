import { useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { adminAPI } from '../../utils/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { 
  Users, 
  Package, 
  Clock,
  Check,
  X,
  ArrowRight
} from 'lucide-react'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { data, isLoading, refetch } = useQuery(
    'admin-dashboard',
    () => adminAPI.getDashboard(),
    {
      select: (response) => response.data
    }
  )

  const handleApprove = async (productId) => {
    try {
      await adminAPI.approveProduct(productId)
      toast.success('Product approved successfully!')
      queryClient.invalidateQueries('admin-dashboard')
      refetch()
    } catch (error) {
      console.error('Error approving product:', error)
      toast.error(error.response?.data?.message || 'Failed to approve product')
    }
  }

  const handleReject = async (productId) => {
    const reason = prompt('Reason for rejection:')
    if (reason) {
      try {
        await adminAPI.rejectProduct(productId, reason)
        toast.success('Product rejected')
        queryClient.invalidateQueries('admin-dashboard')
        refetch()
      } catch (error) {
        console.error('Error rejecting product:', error)
        toast.error(error.response?.data?.message || 'Failed to reject product')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const { stats, recent } = data || {}

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <Package className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Products',
      value: stats?.pendingProducts || 0,
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your marketplace</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Users</h2>
            <div className="space-y-4">
              {recent?.users?.map((user) => (
                <div key={user._id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {user.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Products */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Products</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/products')}
                className="text-xs"
              >
                View All
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {recent?.products?.length > 0 ? (
                recent.products.map((product) => (
                  <div key={product._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <img
                      src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 line-clamp-1">{product.title}</p>
                      <p className="text-sm text-gray-500">by {product.seller?.name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        product.status === 'approved' ? 'bg-green-100 text-green-800' :
                        product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                      {product.status === 'pending' && (
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(product._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 h-auto"
                            title="Approve"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(product._id)}
                            className="text-red-600 hover:text-red-700 hover:border-red-300 border-red-300 px-2 py-1 h-auto"
                            title="Reject"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No products yet</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
