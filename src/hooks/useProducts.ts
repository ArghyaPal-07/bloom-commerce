import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image: string;
  category: string;
  rating: number | null;
  reviews_count: number | null;
  in_stock: boolean | null;
  featured: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useProducts = (options?: {
  category?: string;
  featured?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.category) {
        query = query.eq('category', options.category);
      }

      if (options?.featured) {
        query = query.eq('featured', true);
      }

      if (options?.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Product | null;
    },
    enabled: !!id,
  });
};

export const useFeaturedProducts = () => {
  return useProducts({ featured: true });
};

// Categories are still static since we don't have a categories table
export const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets and tech essentials',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Stylish apparel for every occasion',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    description: 'Beautiful pieces for your living space',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Complete your look with premium accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  },
];
