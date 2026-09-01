import React, { useState } from 'react';
import { 
  Pill, 
  Search, 
  ShoppingCart, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Plus, 
  Minus, 
  CheckCircle2 
} from 'lucide-react';
import { PharmacyItem, PharmacyOrder } from '../types/app';
import { PHARMACY_ITEMS } from '../data/mockHealthcareData';

interface PharmacyViewProps {
  orders: PharmacyOrder[];
  onPlaceOrder: (order: PharmacyOrder) => void;
}

export const PharmacyView: React.FC<PharmacyViewProps> = ({
  orders,
  onPlaceOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cart, setCart] = useState<{ item: PharmacyItem; quantity: number }[]>([]);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState(false);

  const filteredItems = PHARMACY_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: PharmacyItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((c) => {
          if (c.item.id === itemId) {
            const newQ = c.quantity + delta;
            return newQ > 0 ? { ...c, quantity: newQ } : null;
          }
          return c;
        })
        .filter(Boolean) as { item: PharmacyItem; quantity: number }[];
    });
  };

  const cartTotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newOrder: PharmacyOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      totalAmount: cartTotal,
      status: 'PROCESSING',
      deliveryAddress: 'Apartment 402, Lotus Residency, Metro City',
      orderDate: 'Just now',
      estimatedDelivery: 'Delivery in 45 mins',
    };
    onPlaceOrder(newOrder);
    setCart([]);
    setOrderSuccessMsg(true);
    setTimeout(() => setOrderSuccessMsg(false), 5000);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                Rapid 45-Min Dispatch
              </span>
              <span className="text-xs text-slate-400 font-medium">Licensed Pharmacy & Auto-Refill</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Sanjeevani E-Pharmacy Store</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified clinical medications, OTC remedies, chronic care packages, and diagnostic kits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-600" />
              <span className="font-semibold text-slate-700">Free Express Delivery on orders over $25</span>
            </div>
          </div>
        </div>

        {orderSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Prescription order placed successfully! Rider is being assigned for immediate dispatch.</span>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          
          {/* Products Catalogue */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            
            {/* Search & Category Filter */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search medicines, salts, brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto">
                {['ALL', 'Prescription', 'OTC', 'Chronic Care', 'Supplements'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Medicine Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const inCart = cart.find((c) => c.item.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-sky-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.category === 'Prescription'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-sky-50 text-sky-700'
                        }`}>
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">★ {item.rating}</span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mt-2">{item.name}</h3>
                      <p className="text-xs text-slate-500">{item.genericName}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{item.dosage}</p>

                      <div className="mt-2 text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {item.deliveryTime}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-base font-bold text-slate-900">${item.price.toFixed(2)}</span>
                      
                      {inCart ? (
                        <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-slate-600 hover:text-slate-900 p-0.5 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-slate-800">{inCart.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-slate-600 hover:text-slate-900 p-0.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart & Active Orders Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Cart Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900">Your Prescription Cart</h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">{cart.length} items</span>
              </div>

              {cart.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Cart is currently empty.</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((c) => (
                    <div key={c.item.id} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-slate-800">{c.item.name}</p>
                        <p className="text-slate-400">${c.item.price} × {c.quantity}</p>
                      </div>
                      <span className="font-bold text-slate-900">
                        ${(c.item.price * c.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm font-bold">
                    <span>Total Amount:</span>
                    <span className="text-sky-600">${cartTotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    Place Express Order (COD / Insurance)
                  </button>
                </div>
              )}
            </div>

            {/* Active Delivery Tracker */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Active Deliveries
              </h3>

              {orders.slice(0, 2).map((ord) => (
                <div key={ord.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">{ord.id}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-semibold">
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-slate-500">{ord.estimatedDelivery}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
