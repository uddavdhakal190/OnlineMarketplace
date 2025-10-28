import { useState } from 'react'
import { useQuery } from 'react-query'
import { adminAPI } from '../../utils/api'
import { formatDate } from '../../utils/helpers'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { User, Mail, Calendar, Shield, UserCheck, UserX } from 'lucide-react'

const AdminUsers = () => {
  const [roleFilter, setRoleFilter] = useState('all')

  const { data, isLoading, refetch } = useQuery(
    ['admin-users', roleFilter],
    () => adminAPI.getUsers({ 
      role: roleFilter === 'all' ? undefined : roleFilter 
    }),
    {
      select: (response) => response.data
    }
  )

  const roleOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'buyer', label: 'Buyers' },
    { value: 'seller', label: 'Sellers' },
    { value: 'admin', label: 'Admins' }
  ]

  const handleToggleStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId)
      refetch()
    } catch (error) {
      console.error('Error toggling user status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all users in the marketplace</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setRoleFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  roleFilter === option.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : data?.users?.length > 0 ? (
          <div className="space-y-4">
            {data.users.map((user) => (
              <Card key={user._id} className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {user.name?.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Joined {formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(user._id)}
                      className={user.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                    >
                      {user.isActive ? (
                        <>
                          <UserX className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {roleFilter === 'all' 
                ? "No users in the system yet." 
                : `No ${roleFilter} users found.`
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <Button variant="outline" disabled={!data.pagination.hasPrev}>
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {data.pagination.currentPage} of {data.pagination.totalPages}
              </span>
              <Button variant="outline" disabled={!data.pagination.hasNext}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
