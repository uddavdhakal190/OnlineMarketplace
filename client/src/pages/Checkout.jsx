import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { productsAPI } from '../utils/api'
import { formatCurrency } from '../utils/helpers'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { ArrowLeft, Shield, Truck, CreditCard } from 'lucide-react'

const Checkout = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const { data: product, isLoading } = useQuery(
    ['product', productId],
    () => productsAPI.getProduct(productId),
    {
      select: (response) => response.data,
      enabled: !!productId
    }
  )

  const onSubmit = async (data) => {
    setIsProcessing(true)
    try {
      // TODO: Implement Stripe checkout
      console.log('Checkout data:', data)
      console.log('Product:', product)
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      navigate('/orders')
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
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
          <p className="text-gray-600 mb-4">The product you're trying to buy doesn't exist.</p>
          <Button onClick={() => navigate('/products')}>
            Browse Products
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
            onClick={() => navigate(`/products/${productId}`)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Complete your purchase</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Shipping Address */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      {...register('firstName', { required: 'First name is required' })}
                      error={errors.firstName?.message}
                    />
                    <Input
                      label="Last Name"
                      {...register('lastName', { required: 'Last name is required' })}
                      error={errors.lastName?.message}
                    />
                  </div>
                  
                  <Input
                    label="Street Address"
                    {...register('street', { required: 'Street address is required' })}
                    error={errors.street?.message}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      {...register('city', { required: 'City is required' })}
                      error={errors.city?.message}
                    />
                    <Input
                      label="State"
                      {...register('state', { required: 'State is required' })}
                      error={errors.state?.message}
                    />
                    <Input
                      label="ZIP Code"
                      {...register('zipCode', { required: 'ZIP code is required' })}
                      error={errors.zipCode?.message}
                    />
                  </div>
                  
                  <Input
                    label="Country"
                    {...register('country', { required: 'Country is required' })}
                    error={errors.country?.message}
                  />
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Credit/Debit Card</p>
                        <p className="text-sm text-gray-500">Secure payment powered by Stripe</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>Your payment information is encrypted and secure.</p>
                    <p>We accept Visa, Mastercard, American Express, and more.</p>
                  </div>
                </div>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isProcessing}
                loading={isProcessing}
              >
                {isProcessing ? 'Processing Payment...' : `Pay ${formatCurrency(product.price)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{product.title}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(product.price)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Truck className="h-4 w-4 mr-2" />
                  <span>Fast and reliable shipping</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Protected by Stripe</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
