import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle, Loader2 } from 'lucide-react';

interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  paymentMethod: 'cod' | 'upi';
}

interface CheckoutFormProps {
  onSuccess?: () => void;
}

const initialFormData: FormData = {
  fullName: '',
  phoneNumber: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  paymentMethod: 'cod',
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { state: cartState, dispatch } = useCart();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.fullName.trim())) {
      newErrors.fullName = 'Name should be 2-50 characters long and contain only letters';
    }
    
    // Phone number validation (Indian format)
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Enter a valid 10-digit Indian phone number';
    }
    
    // Email validation with more comprehensive regex
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address (minimum 10 characters)';
    }
    
    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (!/^[a-zA-Z\s]{2,30}$/.test(formData.city.trim())) {
      newErrors.city = 'Enter a valid city name';
    }
    
    // State validation
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    } else if (!/^[a-zA-Z\s]{2,30}$/.test(formData.state.trim())) {
      newErrors.state = 'Enter a valid state name';
    }
    
    // Pincode validation (Indian format)
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[1-9][0-9]{5}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }

    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sanitize form data before submission
  const sanitizeFormData = (data: FormData): FormData => {
    return {
      ...data,
      fullName: data.fullName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      email: data.email.trim().toLowerCase(),
      address: data.address.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      pincode: data.pincode.trim(),
      country: data.country.trim(),
      paymentMethod: data.paymentMethod
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedData = sanitizeFormData(formData);
      
      // Simulate API call with sanitized data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form and cart after 2 seconds
      setTimeout(() => {
        setFormData(initialFormData);
        dispatch({ type: 'CLEAR_CART' });
        setShowSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error('Order placement failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return cartState.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Helper function to render required field indicator
  const RequiredField: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-center space-x-1">
      <span className="text-sm font-medium text-gray-700">{text}</span>
      <span className="text-red-500">*</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-instrument mb-6 text-gray-900">Checkout Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <RequiredField text="Full Name" />
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                maxLength={50}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-maroon-300 focus:border-maroon-500 transition-all duration-200 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                aria-required="true"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Phone and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <RequiredField text="Phone Number" />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  maxLength={10}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-maroon-300 focus:border-maroon-500 transition-all duration-200 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                  aria-required="true"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <RequiredField text="Email Address" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-maroon-300 focus:border-maroon-500 transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  aria-required="true"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <RequiredField text="Address" />
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-maroon-300 focus:border-maroon-500 transition-all duration-200 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full address"
                aria-required="true"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <RequiredField text="City" />
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  maxLength={30}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-maroon-300 focus:border-maroon-500 transition-all duration-200 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter city"
                  aria-required="true"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )}
              </div>

              <div>
                <RequiredField text="State" />
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  maxLength={30}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-maroon-300 focus:border-maroon-500 transition-all duration-200 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter state"
                  aria-required="true"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                )}
              </div>

              <div>
                <RequiredField text="Pincode" />
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  maxLength={6}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-maroon-300 focus:border-maroon-500 transition-all duration-200 ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter pincode"
                  aria-required="true"
                />
                {errors.pincode && (
                  <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>
                )}
              </div>
            </div>

            {/* Country */}
            <div>
              <RequiredField text="Country" />
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-maroon-300 focus:border-maroon-500 transition-all duration-200 ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter country"
                aria-required="true"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-500">{errors.country}</p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <RequiredField text="Payment Method" />
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-maroon-600 focus:ring-maroon-500"
                    aria-required="true"
                  />
                  <span className="text-gray-700">Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-3 cursor-not-allowed opacity-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    disabled
                    className="form-radio h-4 w-4 text-maroon-600 focus:ring-maroon-500"
                  />
                  <span className="text-gray-700">UPI (coming soon)</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || cartState.items.length === 0}
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-maroon-600 hover:bg-maroon-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-500 transition-colors duration-200 ${
                (isSubmitting || cartState.items.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label={isSubmitting ? 'Processing order...' : 'Place Order'}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Processing...
                </span>
              ) : (
                'Place Order'
              )}
            </button>
          </form>
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 h-fit">
          <h2 className="text-2xl font-instrument mb-6 text-gray-900">Order Summary</h2>
          
          {cartState.items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <p>Quantity: {item.quantity}</p>
                        <p className="font-mono">ID: {item.product.id}</p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">₹{item.product.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-maroon-600">₹{calculateTotal()}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-up">
          <CheckCircle className="h-5 w-5" />
          <span>Order placed successfully!</span>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm; 