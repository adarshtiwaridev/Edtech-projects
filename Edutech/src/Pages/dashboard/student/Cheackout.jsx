import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetCart } from '../../../slices/cartSlices';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const total = cartItems.reduce((acc, item) => acc + Number(item.price), 0);

  const handlePayment = () => {
    // 🔥 TEMP: simulate success
    alert('Payment Successful ✅');

    // 👉 clear cart
    dispatch(resetCart());

    // 👉 go to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      <p className="mb-2">Courses: {cartItems.length}</p>
      <p className="mb-6 font-bold">Total: ₹{total}</p>

      <button
        onClick={handlePayment}
        className="bg-green-600 text-white px-6 py-3 rounded-xl"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;