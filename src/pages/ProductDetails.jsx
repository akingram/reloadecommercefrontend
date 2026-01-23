import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, Plus, Minus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, setCartStatus } from '../redux/slices/cartSlices';
import { getProductById } from '../service/userApi';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeTab, setActiveTab] = useState('description');
  const [currentImage, setCurrentImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { status } = useSelector((state) => state.cart);
  // Fallback mock data
  const mockProduct = {
    id: id || '1',
    title: 'Elegant Summer Dress',
    price: 89000,
    originalPrice: 120000,
    images: [
      'https://i.pinimg.com/736x/ae/f5/ab/aef5ab486f2e361248cde0722fe2fcac.jpg',
      'https://i.pinimg.com/736x/b7/00/8c/b7008c7529a2a77fc59d6d13ef291ca5.jpg',
      'https://i.pinimg.com/736x/c9/f3/72/c9f372338b9f33009827e016c809dc83.jpg',
    ],
    seller: { storeName: 'Boutique Style' },
    rating: 4.8,
    reviews: 156,
    isNew: true,
    isFeatured: true,
    description:
      'This elegant summer dress combines comfort with style. Perfect for any occasion, featuring a flattering silhouette and premium fabric blend.',
    features: [
      'High-quality fabric blend',
      'Machine washable',
      'Wrinkle resistant',
      'Available in multiple colors',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Black', 'White', 'Rose'],
    specifications: {
      Material: '65% Cotton, 35% Polyester',
      Care: 'Machine wash cold',
      Origin: 'Made in Italy',
      Fit: 'True to size',
    },
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct({
          ...data,
          title: data.title || 'Untitled Product',
          price: Math.round(data.price || 0),
          images: data.images?.length ? data.images : ['https://via.placeholder.com/150'],
          seller: data.seller?.storeName ? { storeName: data.seller.storeName } : { storeName: 'Unknown Seller' },
          isNew: data.createdAt
            ? (new Date() - new Date(data.createdAt)) / (1000 * 60 * 60 * 24) < 7
            : false,
          isFeatured: data.isFeatured || false,
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          sizes: data.sizes || ['XS', 'S', 'M', 'L', 'XL'],
          description: data.description || 'No description available.',
          features: data.features || [],
          specifications: data.specifications || {},
        });
      } catch (error) {
        toast.error(error.message || 'Failed to load product details');
        setProduct(mockProduct);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === "loading") return;

    const item = {
      productId: product._id || product.id,
      name: product.title || product.name || "Untitled Product",
      price: Math.round(product.price || 0),
      image:
        product.images?.[0] ||
        product.image ||
        "https://via.placeholder.com/150",
      seller:
        product.seller?.storeName || product.seller?.name || "Unknown Seller",
      quantity: 1,
    };

    dispatch(setCartStatus({ status: "loading" }));
    dispatch(addItem(item));
    toast.success(`${item.name} added to cart!`);

    // Reset status after a short delay
    setTimeout(() => {
      dispatch(setCartStatus({ status: "succeeded" }));
    }, 500);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-muted mb-6" />
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-muted rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-4 w-48 bg-muted" />
              <div className="h-8 w-64 bg-muted" />
              <div className="h-4 w-32 bg-muted" />
              <div className="h-10 w-40 bg-muted" />
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-9 w-12 bg-muted rounded-md" />
                ))}
              </div>
              <div className="flex gap-3">
                <div className="h-9 w-12 bg-muted rounded-md" />
                <div className="h-9 w-12 bg-muted rounded-md" />
              </div>
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>;
  }

  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  const formattedOriginalPrice = product.originalPrice
    ? new Intl.NumberFormat('en-NG', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(product.originalPrice)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={product.images[currentImage]}
              alt={product.title || product.name}
              className="w-full h-full object-cover"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">
                Featured
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                New
              </span>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  currentImage === index
                    ? 'border-primary'
                    : 'border-transparent hover:border-muted-foreground'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.title || product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.rating > 0 && (
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              )}
              <span className="text-sm text-muted-foreground">
                {product.rating > 0 ? `${product.rating} (${product.reviews} reviews)` : 'No reviews'}
              </span>
            </div>

            <h1 className="text-3xl font-playfair font-bold mb-2">
              {product.title || product.name}
            </h1>

            <p className="text-muted-foreground mb-4">by {product.seller.storeName}</p>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">₦{formattedPrice}</span>
              {formattedOriginalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ₦{formattedOriginalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="font-semibold mb-3">Size</h3>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`h-9 px-3 rounded-md text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-md transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-medium w-12 text-center">{quantity}</span>
              <button
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-md transition-colors"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add to Cart
            </button>
            <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-md flex items-center justify-center transition-colors">
              <Heart className="h-4 w-4" />
            </button>
            <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-md flex items-center justify-center transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Product Details Tabs */}
          <div className="w-full">
            <div className="flex border-b border-border">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">{product.description}</p>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{product.rating || 'N/A'}</div>
                      <div className="flex justify-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating || 0)
                                ? 'fill-primary text-primary'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {product.reviews || 0} reviews
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-center py-8">
                    Review functionality would be implemented with backend integration.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;