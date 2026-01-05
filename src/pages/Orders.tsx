import React from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string; label: string }> = {
  pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
  processing: { icon: Package, color: 'text-info', bg: 'bg-info/10', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-primary', bg: 'bg-primary/10', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-accent', bg: 'bg-accent/10', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Cancelled' },
};

const Orders: React.FC = () => {
  const { orders, user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view orders</h1>
            <Link to="/login"><Button variant="accent">Sign In</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold text-foreground mb-8">
            My Orders
          </motion.h1>
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
              <Link to="/products"><Button variant="accent">Browse Products</Button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                return (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-card rounded-xl p-6 shadow-soft">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg}`}>
                        <StatusIcon className={`h-4 w-4 ${status.color}`} />
                        <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                      </div>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-4">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                            <span className="text-sm font-medium">{item.product_name}</span>
                            <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">{order.items?.length || 0} item(s)</span>
                      <span className="font-bold text-primary">${order.total.toFixed(2)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
