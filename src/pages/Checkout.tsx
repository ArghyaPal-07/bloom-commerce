import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Truck, ShoppingBag, ChevronLeft, Lock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

type CheckoutStep = 'shipping' | 'payment' | 'review';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = total >= 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: ShoppingBag },
  ];

  const validateShipping = () => {
    const newErrors: Record<string, string> = {};
    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    if (!paymentInfo.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }
    if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    if (!paymentInfo.expiry.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiry = 'Enter expiry as MM/YY';
    }
    if (!paymentInfo.cvv.match(/^\d{3,4}$/)) newErrors.cvv = 'Enter a valid CVV';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 'shipping' && validateShipping()) {
      setStep('payment');
    } else if (step === 'payment' && validatePayment()) {
      setStep('review');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const order = addOrder({
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      total: grandTotal,
      status: 'pending',
      shippingAddress: shippingInfo,
      paymentMethod: `****${paymentInfo.cardNumber.slice(-4)}`,
    });

    clearCart();
    setIsProcessing(false);
    
    toast({
      title: 'Order Placed Successfully!',
      description: `Your order #${order.id} has been confirmed.`,
    });

    navigate('/orders');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => step === 'shipping' ? navigate('/cart') : setStep(step === 'review' ? 'payment' : 'shipping')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {step === 'shipping' ? 'Back to Cart' : 'Back'}
          </button>

          {/* Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {steps.map((s, index) => (
                <React.Fragment key={s.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        step === s.id
                          ? 'bg-primary text-primary-foreground'
                          : steps.findIndex(st => st.id === step) > index
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {steps.findIndex(st => st.id === step) > index ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <s.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`font-medium hidden sm:inline ${
                      step === s.id ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 ${
                      steps.findIndex(st => st.id === step) > index
                        ? 'bg-accent'
                        : 'bg-muted'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-xl p-6 shadow-soft"
              >
                {step === 'shipping' && (
                  <div className="space-y-6">
                    <h2 className="font-display text-xl font-bold">Shipping Information</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                          className={errors.firstName ? 'border-destructive' : ''}
                        />
                        {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                          className={errors.lastName ? 'border-destructive' : ''}
                        />
                        {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className={errors.address ? 'border-destructive' : ''}
                      />
                      {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className={errors.city ? 'border-destructive' : ''}
                        />
                        {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className={errors.state ? 'border-destructive' : ''}
                        />
                        {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          className={errors.zipCode ? 'border-destructive' : ''}
                        />
                        {errors.zipCode && <p className="text-xs text-destructive mt-1">{errors.zipCode}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {step === 'payment' && (
                  <div className="space-y-6">
                    <h2 className="font-display text-xl font-bold">Payment Details</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Lock className="h-4 w-4" />
                      <span>Your payment information is secure</span>
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: formatCardNumber(e.target.value) })}
                        maxLength={19}
                        className={errors.cardNumber ? 'border-destructive' : ''}
                      />
                      {errors.cardNumber && <p className="text-xs text-destructive mt-1">{errors.cardNumber}</p>}
                    </div>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                        className={errors.cardName ? 'border-destructive' : ''}
                      />
                      {errors.cardName && <p className="text-xs text-destructive mt-1">{errors.cardName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={paymentInfo.expiry}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                          maxLength={5}
                          className={errors.expiry ? 'border-destructive' : ''}
                        />
                        {errors.expiry && <p className="text-xs text-destructive mt-1">{errors.expiry}</p>}
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                          maxLength={4}
                          type="password"
                          className={errors.cvv ? 'border-destructive' : ''}
                        />
                        {errors.cvv && <p className="text-xs text-destructive mt-1">{errors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {step === 'review' && (
                  <div className="space-y-6">
                    <h2 className="font-display text-xl font-bold">Review Your Order</h2>
                    
                    {/* Shipping Summary */}
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <p className="text-sm text-muted-foreground">
                        {shippingInfo.firstName} {shippingInfo.lastName}<br />
                        {shippingInfo.address}<br />
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                        {shippingInfo.country}
                      </p>
                    </div>

                    {/* Payment Summary */}
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <p className="text-sm text-muted-foreground">
                        Card ending in ****{paymentInfo.cardNumber.slice(-4)}
                      </p>
                    </div>

                    {/* Items */}
                    <div>
                      <h3 className="font-medium mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {items.map(item => (
                          <div key={item.product.id} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
                  {step !== 'review' ? (
                    <Button variant="accent" size="lg" onClick={handleNext}>
                      Continue
                    </Button>
                  ) : (
                    <Button
                      variant="accent"
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-soft sticky top-24">
                <h2 className="font-display text-xl font-bold text-foreground mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? <span className="text-accent">Free</span> : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-primary">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
