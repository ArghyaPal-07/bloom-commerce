import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'userId' | 'createdAt'>) => Order;
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'ecommerce-users';
const CURRENT_USER_KEY = 'ecommerce-current-user';
const ORDERS_STORAGE_KEY = 'ecommerce-orders';

// Initialize default admin user
const initializeDefaultAdmin = () => {
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  const adminExists = users.some((u: User) => u.email === 'admin@store.com');
  if (!adminExists) {
    const adminUser = {
      id: 'admin-1',
      email: 'admin@store.com',
      password: 'admin123',
      name: 'Admin User',
      isAdmin: true,
      createdAt: new Date().toISOString()
    };
    users.push(adminUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    initializeDefaultAdmin();
    
    // Load current user
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse user:', error);
      }
    }

    // Load orders
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to parse orders:', error);
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return { success: true, message: 'Login successful!' };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    if (users.some((u: any) => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'userId' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      userId: user?.id || 'guest',
      createdAt: new Date().toISOString()
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    
    return newOrder;
  };

  const getAllOrders = (): Order[] => {
    return orders;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
  };

  // Filter orders for current user (admin sees all)
  const userOrders = user?.isAdmin 
    ? orders 
    : orders.filter(order => order.userId === user?.id);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        orders: userOrders,
        addOrder,
        getAllOrders,
        updateOrderStatus
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
