import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingCart, ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { removeFromCart, resetCart } from '../../slices/cartSlices';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (Number(item.price) || 0);
  }, 0);

  const handlingFee = cartItems.length > 0 ? 0 : 0;
  const total = subtotal + handlingFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/dashboard/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShoppingCart size={28} className="text-blue-500" />
              My Shopping Cart
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {cartItems.length} course{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>

            {cartItems.length > 0 && (
              <button
                onClick={() => dispatch(resetCart())}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors"
              >
                <Trash2 size={16} />
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <ShoppingCart size={52} className="mx-auto text-slate-400 dark:text-slate-600" />
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Explore our curated curriculum and enroll in industry-leading fullstack courses today.
            </p>
            <Link
              to="/courses"
              className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Cart Items */}
            <section className="lg:col-span-2 space-y-4">
              {cartItems.map((item, idx) => {
                const title = item.title || item.courseName || "Untitled Course";
                const instructor = item.instructor || item.instructorName || "Instructor";
                const thumbnail = item.image || item.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800";
                const price = Number(item.price) || 0;

                return (
                  <article
                    key={item.id || item._id || idx}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">

                      <img
                        src={thumbnail}
                        alt={title}
                        className="w-full sm:w-40 h-28 object-cover rounded-xl bg-slate-100 dark:bg-slate-800"
                      />

                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug">{title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          by {instructor}
                        </p>

                        <div className="flex justify-between items-center mt-4">
                          <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                            ₹{price.toFixed(2)}
                          </p>

                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle size={14} /> Ready for Enrollment
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => dispatch(removeFromCart(item))}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors self-start"
                        title="Remove from cart"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* Summary Sidebar */}
            <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-fit sticky top-24 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between text-base">
                  <span className="font-bold text-slate-900 dark:text-white">Total Amount</span>
                  <span className="font-black text-2xl text-blue-600 dark:text-blue-400">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
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