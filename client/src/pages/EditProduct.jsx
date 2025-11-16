import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { productsAPI } from '../utils/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsAPI.getProduct(id)
        setProduct(response.data)
        reset(response.data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id, reset])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Create FormData for the update (backend expects FormData due to multer middleware)
      const formData = new FormData()
      
      // Add text fields
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('price', parseFloat(data.price))
      formData.append('category', data.category)
      formData.append('condition', 'New') // All products are new
      
      // Add location if it exists
      if (product.location) {
        if (product.location.city) formData.append('location.city', product.location.city)
        if (product.location.state) formData.append('location.state', product.location.state)
        formData.append('location.country', product.location.country || 'Finland')
      }

      // Call API to update product (send FormData)
      await productsAPI.updateProduct(id, formData)
      
      toast.success('Product updated successfully!')
      navigate('/my-products')
    } catch (error) {
      console.error('Error updating product:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      
      let errorMessage = 'Failed to update product. Please try again.'
      
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.map(e => e.msg || e.message).join(', ')
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're trying to edit doesn't exist.</p>
          <Button onClick={() => navigate('/my-products')}>
            Back to My Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/my-products')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">Update your product information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <Input
                label="Product Title"
                defaultValue={product.title}
                error={errors.title?.message}
                {...register('title', { required: 'Title is required' })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  defaultValue={product.description}
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
                  defaultValue={product.price}
                  error={errors.price?.message}
                  {...register('price', { required: 'Price is required' })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    defaultValue={product.category}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    {...register('category', { required: 'Category is required' })}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                    <option value="Books & Media">Books & Media</option>
                    <option value="Toys & Games">Toys & Games</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Current Images */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Images</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images?.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
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
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct
