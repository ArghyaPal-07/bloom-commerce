import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, DollarSign, TrendingUp, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, Order } from '@/context/AuthContext';
import { products as initialProducts, categories } from '@/data/products';

const statusOptions: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const Admin: React.FC = () => {
  const { user, getAllOrders, updateOrderStatus } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const orders = getAllOrders();

  if (!user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-accent/10 text-accent' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-primary/10 text-primary' },
    { label: 'Products', value: initialProducts.length, icon: Package, color: 'bg-info/10 text-info' },
    { label: 'Categories', value: categories.length, icon: TrendingUp, color: 'bg-warning/10 text-warning' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
            <Link to="/"><Button variant="outline">Back to Store</Button></Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            {['dashboard', 'products', 'orders'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 font-medium capitalize transition-colors ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                  <div key={stat.label} className="bg-card rounded-xl p-6 shadow-soft">
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <h2 className="font-display text-xl font-bold mb-4">Recent Orders</h2>
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">#{order.id}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="font-bold">${order.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-card rounded-xl shadow-soft overflow-hidden">
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <h2 className="font-display text-xl font-bold">Products</h2>
                  <Button variant="accent" size="sm"><Plus className="h-4 w-4 mr-2" />Add Product</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 font-medium">Product</th>
                        <th className="text-left p-4 font-medium">Category</th>
                        <th className="text-left p-4 font-medium">Price</th>
                        <th className="text-left p-4 font-medium">Stock</th>
                        <th className="text-right p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {initialProducts.map(product => (
                        <tr key={product.id} className="border-b border-border">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="p-4 capitalize">{product.category.replace('-', ' ')}</td>
                          <td className="p-4">${product.price.toFixed(2)}</td>
                          <td className="p-4">{product.stockCount}</td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-card rounded-xl shadow-soft overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h2 className="font-display text-xl font-bold">All Orders</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 font-medium">Order ID</th>
                        <th className="text-left p-4 font-medium">Customer</th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Total</th>
                        <th className="text-left p-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-border">
                          <td className="p-4 font-medium">#{order.id}</td>
                          <td className="p-4">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</td>
                          <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="p-4 font-bold">${order.total.toFixed(2)}</td>
                          <td className="p-4">
                            <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}>
                              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {statusOptions.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
