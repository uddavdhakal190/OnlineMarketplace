import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Upload, X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { productsAPI } from '../utils/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const CreateProduct = () => {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect non-logged-in users to login
  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return
    
    if (user === null) {
      toast.error('Please login to create a product listing.')
      navigate('/login', { state: { from: '/create-product' } })
      return
    }
    
    // Redirect admin users (all other users can create products)
    if (user && user.role === 'admin') {
      toast.error('Admin cannot create products. Admin role is for management only.')
      navigate('/admin')
    }
  }, [user, loading, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const categories = [
    'Electronics',
    'Fashion',
    'Sports & Outdoors',
    'Books & Media',
    'Toys & Games',
    'Health & Beauty',
    'Other'
  ]

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    // Validate files
    const validFiles = files.filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        return false
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`)
        return false
      }
      
      return true
    })
    
    if (validFiles.length === 0) return
    
    // Check total image count
    if (images.length + validFiles.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }
    
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Create FormData for file upload
      const formData = new FormData()
      
      // Add text fields
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('price', data.price)
      formData.append('category', data.category)
      formData.append('condition', 'New') // All products are brand new
      
      // Add location (use dot notation for nested objects)
      if (data.location) {
        if (data.location.city) formData.append('location.city', data.location.city)
        if (data.location.state) formData.append('location.state', data.location.state)
        formData.append('location.country', data.location.country || 'Finland')
      }
      
      // Add images
      if (images.length === 0) {
        toast.error('Please upload at least one product image')
        setIsSubmitting(false)
        return
      }
      
      images.forEach((image) => {
        formData.append('images', image.file)
      })
      
      // Create product
      const response = await productsAPI.createProduct(formData)
      
      toast.success('Product created successfully! It will be reviewed by admin.')
      navigate('/my-products')
    } catch (error) {
      console.error('Error creating product:', error)
      console.error('Error response:', error.response?.data)
      
      // Get error message from response
      let message = 'Failed to create product. Please try again.'
      if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        message = error.response.data.errors.map(e => e.msg || e.message).join(', ')
      } else if (error.message) {
        message = error.message
      }
      
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Don't render form if user is not logged in or is admin (will be redirected)
  if (!user || user.role === 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          <p className="text-gray-600">Add a new product to your store</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <Input
                label="Product Title"
                placeholder="Enter product title"
                error={errors.title?.message}
                {...register('title', { required: 'Title is required' })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your product..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  error={errors.price?.message}
                  {...register('price', { required: 'Price is required' })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    {...register('category', { required: 'Category is required' })}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Images */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Images</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Add Image</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <p className="text-sm text-gray-500">
                Upload up to 5 images. First image will be used as the main image.
              </p>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                placeholder="e.g., Helsinki"
                defaultValue=""
                {...register('location.city', { 
                  required: 'City is required',
                  validate: value => value.trim() !== '' || 'Please enter a city in Finland'
                })}
              />
              <Input
                label="State/Region"
                placeholder="e.g., Uusimaa"
                defaultValue=""
                {...register('location.state')}
              />
              <Input
                label="Country"
                placeholder="Finland"
                defaultValue="Finland"
                {...register('location.country', { 
                  required: true 
                })}
              />
              <p className="text-xs text-gray-500 mt-1">This marketplace is only available in Finland</p>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/my-products')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProduct
