import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  shipping_address: ShippingAddress | null;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  orders: Order[];
  addOrder: (order: {
    items: { productId: string; productName: string; price: number; quantity: number; image: string }[];
    total: number;
    status: string;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
  }) => Promise<Order | null>;
  getAllOrders: () => Promise<Order[]>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (data && !error) {
      setProfile(data as Profile);
    }
  };

  // Check if user is admin
  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    setIsAdmin(!!data && !error);
  };

  // Fetch user orders
  const fetchOrders = async () => {
    if (!user) return;

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    // If not admin, only fetch user's orders
    if (!isAdmin) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (data && !error) {
      setOrders(data.map(order => ({
        id: order.id,
        user_id: order.user_id,
        status: order.status,
        total: Number(order.total),
        shipping_address: order.shipping_address as unknown as ShippingAddress | null,
        created_at: order.created_at,
        items: order.order_items,
      })));
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer Supabase calls with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setOrders([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        checkAdminRole(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch orders when user/admin status changes
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, isAdmin]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Login successful!' };
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: name,
        }
      }
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Account created successfully!' };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
    setOrders([]);
  };

  const addOrder = async (orderData: {
    items: { productId: string; productName: string; price: number; quantity: number; image: string }[];
    total: number;
    status: string;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
  }): Promise<Order | null> => {
    if (!user) return null;

    // Create order - cast shipping address to Json compatible type
    const shippingAddressJson = JSON.parse(JSON.stringify(orderData.shippingAddress));
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id,
        status: orderData.status,
        total: orderData.total,
        shipping_address: shippingAddressJson,
      }])
      .select()
      .single();

    if (orderError || !order) {
      console.error('Failed to create order:', orderError);
      return null;
    }

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      product_price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Failed to create order items:', itemsError);
    }

    await fetchOrders();
    return {
      id: order.id,
      user_id: order.user_id,
      status: order.status,
      total: Number(order.total),
      shipping_address: order.shipping_address as unknown as ShippingAddress | null,
      created_at: order.created_at,
    };
  };

  const getAllOrders = async (): Promise<Order[]> => {
    if (!isAdmin) return orders;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (data && !error) {
      return data.map(order => ({
        id: order.id,
        user_id: order.user_id,
        status: order.status,
        total: Number(order.total),
        shipping_address: order.shipping_address as unknown as ShippingAddress | null,
        created_at: order.created_at,
        items: order.order_items,
      }));
    }

    return [];
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (!error) {
      await fetchOrders();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isAdmin,
        login,
        signup,
        logout,
        orders,
        addOrder,
        getAllOrders,
        updateOrderStatus,
        fetchOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
