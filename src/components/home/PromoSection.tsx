import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% protected',
  },
  {
    icon: RefreshCw,
    title: '30-Day Returns',
    description: 'Hassle-free policy',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated help',
  },
];

const PromoSection: React.FC = () => {
  return (
    <>
      {/* Features Bar */}
      <section className="py-12 bg-background border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center text-primary-foreground"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Upgrade Your Lifestyle?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Join thousands of satisfied customers who trust ModernStore for premium quality products.
            </p>
            <Link to="/products">
              <Button variant="hero" size="xl">
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PromoSection;
