import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { CreditCard, ShieldCheck, ArrowLeft, CheckCircle2, Lock, ShoppingBag } from 'lucide-react';
import { resetCart } from '../../../slices/cartSlices';
import { loadRazorpayScript } from '../../../services/razorpayService';
import { createOrderApi, getRazorpayKeyApi, verifyRazorpayPaymentApi } from '../../../services/courseService';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const user = useSelector((state) => state.profile?.user || state.auth?.user);

  const [loading, setLoading] = useState(false);

  const totalAmount = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const courseIds = cartItems.map((item) => item.id || item._id);

  const handleRazorpayPayment = async () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      // Load Razorpay Script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load. Please check internet connection.");
        setLoading(false);
        return;
      }

      // Fetch Razorpay Key
      const key = await getRazorpayKeyApi();

      // Create Order on Backend
      const orderResponse = await createOrderApi({
        courseId: courseIds[0],
        courses: courseIds,
      });

      if (orderResponse?.alreadyEnrolled) {
        toast.info("You are already enrolled in this course! Heading to your learning dashboard.");
        dispatch(resetCart());
        navigate("/dashboard/student/my-courses");
        setLoading(false);
        return;
      }

      if (orderResponse?.simulated || orderResponse?.freeEnrollment) {
        toast.success(orderResponse.message || "Enrollment completed successfully!");
        dispatch(resetCart());
        navigate("/dashboard/student/my-courses");
        setLoading(false);
        return;
      }

      if (!orderResponse?.success || !orderResponse?.orderId) {
        toast.error(orderResponse?.message || "Failed to initialize order");
        setLoading(false);
        return;
      }

      const options = {
        key: key || "rzp_test_GCr46JGQ2wxtTV",
        amount: orderResponse.amount || totalAmount * 100,
        currency: orderResponse.currency || "INR",
        name: "EdTech Learning Hub",
        description: `Enrollment for ${cartItems.length} course(s)`,
        image: "/Images/logo2.png",
        order_id: orderResponse.orderId,
        handler: async (response) => {
          try {
            setLoading(true);
            const verifyRes = await verifyRazorpayPaymentApi({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courses: courseIds,
              courseId: courseIds[0],
            });

            if (verifyRes?.success) {
              toast.success("Payment successful! You are now enrolled in your courses.");
              dispatch(resetCart());
              navigate("/dashboard/student/my-courses");
            } else {
              toast.error(verifyRes?.message || "Payment verification failed");
            }
          } catch (verifyErr) {
            toast.error(verifyErr.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          email: user?.email || '',
          contact: user?.mobile || '',
        },
        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
        setLoading(false);
      });
      paymentObject.open();
    } catch (error) {
      console.error("Checkout Payment Error:", error);
      toast.error(error.response?.data?.message || error.message || "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl max-w-md w-full space-y-4 shadow-sm">
          <ShoppingBag size={48} className="mx-auto text-slate-400 dark:text-slate-600" />
          <h2 className="text-2xl font-bold">No Courses in Checkout</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please add courses to your cart before proceeding to checkout.
          </p>
          <Link
            to="/courses"
            className="inline-block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Return to Cart
          </Link>

          <span className="text-xs px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
            <Lock size={12} /> 256-Bit SSL Encrypted
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout Order Review</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete your payment securely via Razorpay to instantly unlock all lecture videos and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Order Details List */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-3">Selected Courses ({cartItems.length})</h3>

              <div className="space-y-3">
                {cartItems.map((item, idx) => {
                  const title = item.title || item.courseName || "Untitled Course";
                  const instructor = item.instructor || item.instructorName || "Instructor";
                  const price = Number(item.price) || 0;
                  const thumbnail = item.image || item.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800";

                  return (
                    <div key={item.id || item._id || idx} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                      <img src={thumbnail} alt={title} className="w-16 h-12 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs truncate text-slate-900 dark:text-white">{title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">by {instructor}</p>
                      </div>
                      <span className="font-bold text-sm text-blue-600 dark:text-blue-400">₹{price.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Student Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Learner Details</h3>
              <div className="text-sm space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Payment Summary Box */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Payment Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Courses ({cartItems.length})</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Platform Fee</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">FREE</span>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between text-base">
                  <span className="font-bold">Total Payable</span>
                  <span className="font-black text-2xl text-blue-600 dark:text-blue-400">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={handleRazorpayPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pay Now via Razorpay
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
                <ShieldCheck size={14} className="text-emerald-500" />
                Official Razorpay Gateway Integration
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;