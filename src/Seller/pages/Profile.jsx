import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Save, 
  Upload, 
  CreditCard,
  Shield, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { updateSellerProfile, setupSellerPayment, getBanks, verifyBankAccount } from '../../service/sellerApi';
import { updateSeller } from '../../redux/slices/sellerSlices';

const Profile = () => {
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(seller?.profileImage || '');
  const [activeTab, setActiveTab] = useState('profile');
  
  const [accountNameLoading, setAccountNameLoading] = useState(false);
  const [accountNameVerified, setAccountNameVerified] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      storeName: seller?.storeName || '',
      email: seller?.email || '',
      phoneNumber: seller?.phoneNumber || '',
      address: seller?.address || '',
      categories: seller?.categories || '',
      description: seller?.description || '',
      bankCode: seller?.bankDetails?.bankCode || '',
      accountNumber: seller?.bankDetails?.accountNumber || '',
      accountName: seller?.bankDetails?.accountName || ''
    }
  });

  const accountNumber = watch('accountNumber');
  const bankCode = watch('bankCode');
  const accountName = watch('accountName');

  // Test accounts for development
  const TEST_ACCOUNTS = [
    { number: '0000000000', bank: '044', name: 'Access Bank' },
    { number: '1111111111', bank: '058', name: 'GTBank' },
    { number: '2222222222', bank: '232', name: 'Sterling Bank' },
  ];

  // Fetch banks when payment tab is active
  useEffect(() => {
    if (activeTab === 'payment' && banks.length === 0) {
      fetchBanks();
    }
  }, [activeTab]);

  const fetchBanks = async () => {
    try {
      setBanksLoading(true);
      const response = await getBanks();
      setBanks(response.banks || []);
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      toast.error('Failed to load bank list');
    } finally {
      setBanksLoading(false);
    }
  };

  // Simple account verification
  const verifyAccount = async () => {
    if (!accountNumber || accountNumber.length !== 10 || !bankCode) {
      return;
    }

    try {
      setAccountNameLoading(true);
      const response = await verifyBankAccount(accountNumber, bankCode);
      
      if (response.success) {
        setValue('accountName', response.accountName);
        setAccountNameVerified(true);
        toast.success('Account verified successfully!');
      }
    } catch (error) {
      console.error('Account verification error:', error);
      // In development, provide helpful message
      if (process.env.NODE_ENV === 'development') {
        toast.info('Using test mode - you can enter account name manually');
      }
    } finally {
      setAccountNameLoading(false);
    }
  };

  // Auto-verify when both fields are filled
  useEffect(() => {
    if (accountNumber && accountNumber.length === 10 && bankCode) {
      verifyAccount();
    }
  }, [accountNumber, bankCode]);

  const onProfileSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await updateSellerProfile(data);
      dispatch(updateSeller(response.seller));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onPaymentSubmit = async (data) => {
    try {
      setPaymentLoading(true);
      
      // Get bank name
      const selectedBank = banks.find(bank => bank.code === data.bankCode);
      const paymentData = {
        ...data,
        bankName: selectedBank?.name || ''
      };
      
      console.log('Submitting payment data:', paymentData);
      
      const response = await setupSellerPayment(paymentData);
      dispatch(updateSeller(response.seller));
      toast.success('Payment details saved successfully!');
    } catch (error) {
      console.error('Payment setup error:', error);
      
      // Show specific error messages
      if (error.message.includes('busy') || error.message.includes('429')) {
        toast.error('Payment service is busy. Please try again in a few moments.');
      } else if (error.message.includes('unavailable') || error.message.includes('503')) {
        toast.error('Payment service is temporarily unavailable. Please try again later.');
      } else if (error.message.includes('timeout')) {
        toast.error('Request timeout. Please check your connection and try again.');
      } else {
        toast.error(error.message || 'Failed to setup payment');
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to fill test account
  const fillTestAccount = (testAccount) => {
    setValue('accountNumber', testAccount.number);
    setValue('bankCode', testAccount.bank);
    // Account name will auto-fill via verification
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Store Profile</h1>
        <p className="text-gray-600">Manage your store information and payment settings</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-[#36d7b7] text-[#36d7b7]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              Store Profile
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payment'
                  ? 'border-[#36d7b7] text-[#36d7b7]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="h-4 w-4 inline mr-2" />
              Payment Details
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
              {/* Profile Image */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Store" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-[#36d7b7] text-white p-1 rounded-full cursor-pointer hover:bg-[#2abca0] transition-colors">
                    <Upload className="h-4 w-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Store Logo</h3>
                  <p className="text-sm text-gray-600">Upload your store logo or image</p>
                </div>
              </div>

              {/* Store Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    {...register("storeName", { required: "Store name is required" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7]"
                  />
                  {errors.storeName && (
                    <p className="text-red-600 text-sm mt-1">{errors.storeName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7]"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register("phoneNumber", { required: "Phone number is required" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7]"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-600 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories *
                  </label>
                  <select
                    {...register("categories", { required: "Categories are required" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7]"
                  >
                    <option value="">Select Category</option>
                    <option value="fashion">Fashion</option>
                    <option value="electronics">Electronics</option>
                    <option value="home">Home & Garden</option>
                    <option value="beauty">Beauty & Health</option>
                    <option value="sports">Sports & Outdoors</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.categories && (
                    <p className="text-red-600 text-sm mt-1">{errors.categories.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Address *
                </label>
                <input
                  type="text"
                  {...register("address", { required: "Address is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7]"
                />
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Description
                </label>
                <textarea
                  rows={4}
                  {...register("description")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7]"
                  placeholder="Tell customers about your store..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#36d7b7] text-white py-2 px-6 rounded-md hover:bg-[#2abca0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Payment Status */}
            {seller?.isPaymentSetup ? (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <h3 className="font-medium text-green-800">Payment Setup Complete</h3>
                    <p className="text-sm text-green-600 mt-1">
                      Your bank account is configured and ready to receive payments.
                    </p>
                    {seller.bankDetails && (
                      <div className="mt-2 text-sm">
                        <p><strong>Bank:</strong> {seller.bankDetails.bankName}</p>
                        <p><strong>Account:</strong> {seller.bankDetails.accountNumber}</p>
                        <p><strong>Name:</strong> {seller.bankDetails.accountName}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Payment Setup Required</h3>
                    <p className="text-sm text-yellow-600 mt-1">
                      You need to set up your bank account to receive payments from orders.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onPaymentSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bank Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  {banksLoading ? (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading banks...</span>
                    </div>
                  ) : (
                    <>
                      <select
                        {...register("bankCode", { required: "Bank name is required" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7]"
                      >
                        <option value="">Select Bank</option>
                        {banks.map((bank) => (
                          <option key={bank.code} value={bank.code}>
                            {bank.name}
                          </option>
                        ))}
                      </select>
                      {errors.bankCode && (
                        <p className="text-red-600 text-sm mt-1">{errors.bankCode.message}</p>
                      )}
                      
                      {/* Display selected bank name */}
                      {bankCode && (
                        <p className="text-green-600 text-sm mt-2">
                          Selected: <strong>{banks.find(b => b.code === bankCode)?.name}</strong>
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("accountNumber", {
                        required: "Account number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Account number must be 10 digits"
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7] pr-10"
                      placeholder="1234567890"
                      maxLength={10}
                    />
                    {accountNameLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    )}
                    {accountNumber && accountNumber.length === 10 && !accountNameLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.accountNumber && (
                    <p className="text-red-600 text-sm mt-1">{errors.accountNumber.message}</p>
                  )}
                  {accountNumber && accountNumber.length === 10 && (
                    <p className="text-green-600 text-sm mt-1">✓ Valid account number format</p>
                  )}
                </div>
              </div>

              {/* Account Name - FULLY EDITABLE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("accountName", { 
                      required: "Account name is required"
                    })}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7] pr-10 ${
                      accountNameVerified 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Enter account name or wait for auto-fill"
                    // Fully editable - no readOnly
                  />
                  {accountNameLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  )}
                  {accountNameVerified && !accountNameLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.accountName && (
                  <p className="text-red-600 text-sm mt-1">{errors.accountName.message}</p>
                )}
                {accountNameVerified && (
                  <p className="text-green-600 text-sm mt-1">
                    ✓ Account name verified by bank
                  </p>
                )}
                {accountNumber && accountNumber.length === 10 && bankCode && !accountNameVerified && (
                  <p className="text-blue-600 text-sm mt-1">
                    Verifying account name... or enter manually
                  </p>
                )}
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Secure Payment Setup</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      Your bank details are securely verified with Paystack and encrypted. 
                      We never store your full bank account information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={paymentLoading || seller?.isPaymentSetup}
                  className="bg-[#36d7b7] text-white py-2 px-6 rounded-md hover:bg-[#2abca0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {paymentLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Setting up...
                    </>
                  ) : seller?.isPaymentSetup ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Payment Setup Complete
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Save Payment Details
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Payment Instructions with Test Accounts */}
            {!seller?.isPaymentSetup && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">How it works:</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Select your bank from the dropdown</li>
                  <li>Enter your 10-digit account number</li>
                  <li>Account name will be automatically verified and filled</li>
                  <li>You can also enter account name manually if needed</li>
                  <li>Save your payment details</li>
                </ol>
                
                {/* Test Account Helper */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h5 className="font-medium text-yellow-800 mb-2">Development Mode:</h5>
                  <p className="text-sm text-yellow-700 mb-2">
                    Use these test accounts to avoid Paystack limits:
                  </p>
                  <div className="space-y-2">
                    {TEST_ACCOUNTS.map((account, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span>{account.name}:</span>
                        <span className="font-mono bg-yellow-100 px-2 py-1 rounded">
                          {account.number}
                        </span>
                        <button
                          type="button"
                          onClick={() => fillTestAccount(account)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Fill
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;