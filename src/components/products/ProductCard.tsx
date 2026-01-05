import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      originalPrice: product.original_price ? Number(product.original_price) : undefined,
      category: product.category,
      image: product.image,
      images: [product.image],
      rating: product.rating || 0,
      reviews: product.reviews_count || 0,
      inStock: product.in_stock ?? true,
      stockCount: 100,
      featured: product.featured ?? false,
      tags: [],
    });
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const discountPercentage = product.original_price 
    ? Math.round((1 - Number(product.price) / Number(product.original_price)) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="group relative bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discountPercentage && (
                <span className="px-2 py-1 text-xs font-semibold bg-destructive text-destructive-foreground rounded-md">
                  -{discountPercentage}%
                </span>
              )}
              {product.featured && (
                <span className="px-2 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded-md">
                  Featured
                </span>
              )}
            </div>

            {/* Quick Add Button */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="accent"
                onClick={handleAddToCart}
                className="rounded-full shadow-lg"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.category.replace('-', ' ')}
            </p>
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="text-sm font-medium">{product.rating || 0}</span>
              <span className="text-xs text-muted-foreground">({product.reviews_count || 0})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold text-primary">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${Number(product.original_price).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
