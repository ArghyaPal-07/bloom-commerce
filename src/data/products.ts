export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  stockCount: number;
  featured: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets and tech essentials',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
    productCount: 4
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Stylish apparel for every occasion',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
    productCount: 4
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    description: 'Beautiful pieces for your living space',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
    productCount: 4
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Complete your look with premium accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    productCount: 3
  }
];

export const products: Product[] = [
  // Electronics
  {
    id: 'e1',
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and professionals.',
    price: 299.99,
    originalPrice: 349.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&q=80'
    ],
    rating: 4.8,
    reviews: 234,
    inStock: true,
    stockCount: 45,
    featured: true,
    tags: ['wireless', 'noise-canceling', 'premium']
  },
  {
    id: 'e2',
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health monitoring, GPS tracking, and seamless smartphone integration. Water-resistant up to 50 meters.',
    price: 449.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80'
    ],
    rating: 4.6,
    reviews: 189,
    inStock: true,
    stockCount: 32,
    featured: true,
    tags: ['smart', 'fitness', 'premium']
  },
  {
    id: 'e3',
    name: 'Portable Bluetooth Speaker',
    description: 'Compact yet powerful speaker with 360° sound, waterproof design, and 20-hour playtime. Take your music anywhere.',
    price: 129.99,
    originalPrice: 159.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'
    ],
    rating: 4.5,
    reviews: 156,
    inStock: true,
    stockCount: 78,
    featured: false,
    tags: ['portable', 'waterproof', 'bluetooth']
  },
  {
    id: 'e4',
    name: 'Wireless Earbuds Elite',
    description: 'True wireless earbuds with premium sound, touch controls, and a sleek charging case. 8 hours of playtime.',
    price: 179.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80'
    ],
    rating: 4.4,
    reviews: 312,
    inStock: true,
    stockCount: 120,
    featured: false,
    tags: ['wireless', 'compact', 'premium']
  },

  // Clothing
  {
    id: 'c1',
    name: 'Premium Cotton T-Shirt',
    description: 'Ultra-soft 100% organic cotton t-shirt with a modern fit. Breathable fabric perfect for everyday wear.',
    price: 45.00,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'
    ],
    rating: 4.7,
    reviews: 423,
    inStock: true,
    stockCount: 200,
    featured: true,
    tags: ['organic', 'casual', 'essentials']
  },
  {
    id: 'c2',
    name: 'Classic Denim Jacket',
    description: 'Timeless denim jacket with a comfortable fit and durable construction. A wardrobe staple for any season.',
    price: 120.00,
    originalPrice: 150.00,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80'
    ],
    rating: 4.6,
    reviews: 198,
    inStock: true,
    stockCount: 45,
    featured: true,
    tags: ['classic', 'denim', 'outerwear']
  },
  {
    id: 'c3',
    name: 'Slim Fit Chinos',
    description: 'Versatile chinos with a modern slim fit. Perfect for both casual and semi-formal occasions.',
    price: 79.99,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80'
    ],
    rating: 4.5,
    reviews: 167,
    inStock: true,
    stockCount: 89,
    featured: false,
    tags: ['slim-fit', 'versatile', 'smart-casual']
  },
  {
    id: 'c4',
    name: 'Merino Wool Sweater',
    description: 'Luxuriously soft merino wool sweater that regulates temperature naturally. Lightweight yet warm.',
    price: 145.00,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80'
    ],
    rating: 4.8,
    reviews: 134,
    inStock: true,
    stockCount: 56,
    featured: false,
    tags: ['merino', 'luxury', 'winter']
  },

  // Home & Garden
  {
    id: 'h1',
    name: 'Modern Ceramic Vase Set',
    description: 'Set of 3 handcrafted ceramic vases in minimalist design. Perfect for fresh or dried flowers.',
    price: 89.99,
    category: 'home-garden',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80'
    ],
    rating: 4.7,
    reviews: 89,
    inStock: true,
    stockCount: 34,
    featured: true,
    tags: ['handcrafted', 'minimalist', 'decor']
  },
  {
    id: 'h2',
    name: 'Indoor Plant Collection',
    description: 'Curated set of 4 low-maintenance indoor plants with decorative pots. Brighten any room naturally.',
    price: 75.00,
    originalPrice: 95.00,
    category: 'home-garden',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80'
    ],
    rating: 4.6,
    reviews: 145,
    inStock: true,
    stockCount: 23,
    featured: false,
    tags: ['plants', 'natural', 'air-purifying']
  },
  {
    id: 'h3',
    name: 'Scented Candle Collection',
    description: 'Set of 6 hand-poured soy candles with natural essential oils. 40-hour burn time each.',
    price: 65.00,
    category: 'home-garden',
    image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&q=80'
    ],
    rating: 4.9,
    reviews: 267,
    inStock: true,
    stockCount: 89,
    featured: true,
    tags: ['natural', 'aromatherapy', 'handmade']
  },
  {
    id: 'h4',
    name: 'Linen Throw Blanket',
    description: 'Premium linen throw blanket in a soothing neutral tone. Soft, breathable, and machine washable.',
    price: 110.00,
    category: 'home-garden',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'
    ],
    rating: 4.7,
    reviews: 98,
    inStock: true,
    stockCount: 41,
    featured: false,
    tags: ['linen', 'cozy', 'premium']
  },

  // Accessories
  {
    id: 'a1',
    name: 'Leather Minimalist Wallet',
    description: 'Slim leather wallet with RFID protection. Holds 8 cards and features a sleek money clip.',
    price: 69.99,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80'
    ],
    rating: 4.8,
    reviews: 312,
    inStock: true,
    stockCount: 156,
    featured: true,
    tags: ['leather', 'rfid', 'minimalist']
  },
  {
    id: 'a2',
    name: 'Classic Sunglasses',
    description: 'Timeless aviator-style sunglasses with polarized lenses and UV400 protection. Unisex design.',
    price: 159.99,
    originalPrice: 199.99,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80'
    ],
    rating: 4.5,
    reviews: 178,
    inStock: true,
    stockCount: 67,
    featured: false,
    tags: ['polarized', 'uv-protection', 'classic']
  },
  {
    id: 'a3',
    name: 'Canvas Weekender Bag',
    description: 'Durable canvas weekender bag with leather accents. Spacious main compartment and multiple pockets.',
    price: 185.00,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'
    ],
    rating: 4.7,
    reviews: 124,
    inStock: true,
    stockCount: 29,
    featured: true,
    tags: ['travel', 'canvas', 'durable']
  }
];

// Helper functions
export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(p => p.category === categoryId);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.featured);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) ||
    p.description.toLowerCase().includes(lowercaseQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
