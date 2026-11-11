import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  MapPin
} from 'lucide-react';
import { CartItem, OrderDetails } from '../types';
import { formatPrice, getWhatsAppLink, BUSINESS_INFO } from '../data/config';
import { submitOrder } from '../firebase';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<OrderDetails | null>(null);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Generate WhatsApp formatted cart order message
  const handleWhatsAppCheckout = () => {
    let message = `*NEW ORDER - ${BUSINESS_INFO.name}*\n\n`;
    message += `*Items Ordered:*\n`;
    cartItems.forEach((item, idx) => {
      message += `${idx + 1}. *${item.product.title}*\n`;
      message += `   Category: ${item.product.category}\n`;
      message += `   Qty: ${item.quantity} x ${item.product.price} SAR = ${item.product.price * item.quantity} SAR\n`;
    });
    message += `\n*Total Amount:* ${formatPrice(totalAmount)}\n`;
    message += `*Shipping:* FREE Delivery Across Riyadh\n`;
    message += `*Payment:* Cash on Delivery (COD)\n`;

    if (customerInfo.name) message += `*Customer:* ${customerInfo.name}\n`;
    if (customerInfo.phone) message += `*Phone:* ${customerInfo.phone}\n`;
    if (customerInfo.address) message += `*Riyadh Address:* ${customerInfo.address}\n`;

    window.open(getWhatsAppLink(message), '_blank');
  };

  const handleCODOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData: OrderDetails = {
      id: `RFH-${Date.now()}`,
      customerName: customerInfo.name,
      phone: customerInfo.phone,
      address: customerInfo.address,
      city: 'Riyadh',
      notes: customerInfo.notes,
      items: cartItems,
      totalAmount,
      paymentMethod: 'Cash on Delivery',
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    try {
      await submitOrder(orderData);
      setOrderComplete(orderData);
      onClearCart();
    } catch (err) {
      console.error(err);
      // Still show success since it's cached locally
      setOrderComplete(orderData);
      onClearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-800" />
            <h2 className="font-serif font-bold text-lg text-stone-900">
              Shopping Bag
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {orderComplete ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Order Received!
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
                Thank you, <span className="font-semibold text-stone-900">{orderComplete.customerName}</span>. 
                Your order <span className="font-mono text-amber-700 font-bold">#{orderComplete.id}</span> has been logged for delivery in Riyadh.
              </p>
              
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs text-stone-700 space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment:</span>
                  <span className="font-semibold">Cash on Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Total:</span>
                  <span className="font-bold text-stone-900">{formatPrice(orderComplete.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Address:</span>
                  <span className="font-medium text-stone-800">{orderComplete.address}, Riyadh</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={getWhatsAppLink(`Hello Riyadh Furniture Hub, I just placed order #${orderComplete.id} (${formatPrice(orderComplete.totalAmount)}). Please confirm estimated delivery time.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-lg text-xs font-semibold shadow-xs border border-amber-400/30 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-[#C59A3F]" />
                  <span>Notify via WhatsApp</span>
                </a>
              </div>

              <button
                onClick={() => {
                  setOrderComplete(null);
                  setShowCheckoutForm(false);
                  onClose();
                }}
                className="text-xs text-stone-500 hover:text-stone-900 underline pt-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-800">
                Your Shopping Bag is Empty
              </h3>
              <p className="text-stone-500 text-xs max-w-xs mx-auto">
                Explore our handcrafted beds, bedroom sets and medicated mattresses designed for Riyadh homes.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-[#1E232B] hover:bg-black text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Browse Shop Catalog
              </button>
            </div>
          ) : showCheckoutForm ? (
            /* Cash on Delivery Checkout Form */
            <form id="cod-form" onSubmit={handleCODOrderSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Riyadh Delivery Details
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  className="text-xs text-amber-700 hover:underline"
                >
                  Back to Bag
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder="e.g. Abdullah Al-Ghamdi"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="e.g. +966 50 123 4567"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Riyadh Delivery Address & District *
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  placeholder="e.g. Al Olaya St, Building 14, Apartment 4"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Notes / Floor / Instructions
                </label>
                <textarea
                  rows={2}
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                  placeholder="e.g. Please call before arrival, lift available..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Free Delivery Across Riyadh</span>
                </div>
                <div className="text-[11px] text-stone-600">
                  You will pay <strong className="text-stone-900">{formatPrice(totalAmount)}</strong> in cash when our delivery team arrives.
                </div>
              </div>
            </form>
          ) : (
            /* Items List */
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80 items-center justify-between"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-serif font-bold text-xs text-stone-900 truncate">
                      {item.product.title}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      {item.product.category}
                    </p>
                    <div className="font-bold text-xs text-stone-900 mt-1">
                      {formatPrice(item.product.price)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-stone-300 rounded-md overflow-hidden bg-white text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 hover:bg-stone-100 text-stone-600"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-stone-900 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 hover:bg-stone-100 text-stone-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!orderComplete && cartItems.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-stone-900">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Riyadh Delivery:
                </span>
                <span className="font-bold">FREE (0 SAR)</span>
              </div>
              <div className="flex justify-between font-serif font-bold text-base text-stone-950 pt-2 border-t border-stone-200">
                <span>Total:</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {showCheckoutForm ? (
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  form="cod-form"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#1E232B] hover:bg-black text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{isSubmitting ? 'Confirming Order...' : 'Confirm Cash on Delivery Order'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer border border-amber-400/30"
                >
                  <MessageCircle className="w-4 h-4 text-[#C59A3F]" />
                  <span>Send Order to WhatsApp</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#1A2332] hover:bg-black text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Proceed to Cash on Delivery</span>
                  <ArrowRight className="w-4 h-4 text-[#C59A3F] rtl:rotate-180" />
                </button>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer border border-amber-400/30"
                >
                  <MessageCircle className="w-4 h-4 text-[#C59A3F]" />
                  <span>Order Directly via WhatsApp</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
