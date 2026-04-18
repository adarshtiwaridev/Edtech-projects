import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';
import { removeFromCart, resetCart } from '../../slices/cartSlices';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // ✅ FIXED: No quantity
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (Number(item.price) || 0);
  }, 0);

  const handlingFee = cartItems.length > 0 ? 4.99 : 0;
  const total = subtotal + handlingFee;

  // ✅ Checkout Handler
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // 👉 Later connect payment here (Razorpay / Stripe)
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShoppingCart size={28} className="text-blue-500" />
              My Cart
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {cartItems.length} course{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold hover:bg-slate-100"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>

            {cartItems.length > 0 && (
              <button
                onClick={() => dispatch(resetCart())}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700"
              >
                <Trash2 size={16} />
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-2xl">
            <ShoppingCart size={48} className="mx-auto text-slate-400" />
            <h2 className="text-xl font-bold mt-4">Your cart is empty</h2>
            <Link
              to="/courses"
              className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Cart Items */}
            <section className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border rounded-2xl p-4"
                >
                  <div className="flex flex-col sm:flex-row gap-4">

                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full sm:w-40 h-28 object-cover rounded-xl"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        by {item.instructor}
                      </p>

                      <div className="flex justify-between items-center mt-4">
                        <p className="text-xl font-black text-blue-600">
                          ₹{Number(item.price).toFixed(2)}
                        </p>

                        {/* ✅ No quantity */}
                        <span className="text-sm text-green-600 font-semibold">
                          1 Course Selected ✅
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item))}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </section>

            {/* Summary */}
            <aside className="bg-white border rounded-2xl p-5 h-fit sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Handling</span>
                  <span>₹{handlingFee.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-black text-blue-600">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <CreditCard size={18} />
                Proceed to Checkout
              </button>
            </aside>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;