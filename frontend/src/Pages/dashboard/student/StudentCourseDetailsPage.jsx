import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import CourseDetail from "../../../Components/course/CourseDetail";
import { fetchCourseById, fetchEnrolledCourses } from "../../../slices/courseSlice";
import {
  createOrderApi,
  getRazorpayKeyApi,
  verifyRazorpayPaymentApi,
} from "../../../services/courseService";
import { loadRazorpayScript } from "../../../services/razorpayService";

const StudentCourseDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleCourse, enrolledCourses, loading, error } = useSelector((state) => state.course);
  const user = useSelector((state) => state.profile?.user || state.auth?.user);
  const role = user?.accountType || user?.role;
  const [isPaying, setIsPaying] = useState(false);
  const [checkoutOpened, setCheckoutOpened] = useState(false);

  const isEnrolled = enrolledCourses.some((course) => String(course.id) === String(id));

  useEffect(() => {
    dispatch(fetchCourseById(id));
    if (role === "Student") {
      dispatch(fetchEnrolledCourses());
    }
  }, [dispatch, id, role]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleBuy = async () => {
    if (role !== "Student") {
      toast.error("Only students can purchase courses");
      return;
    }

    if (isEnrolled) {
      navigate(`/dashboard/student/learn/${id}`);
      return;
    }

    if (checkoutOpened) {
      toast.error("A checkout is already open for this course");
      return;
    }

    try {
      setIsPaying(true);

      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        toast.error("Unable to load Razorpay SDK");
        return;
      }

      const keyId = await getRazorpayKeyApi();
      if (!keyId) {
        toast.error("Razorpay key is missing on server");
        return;
      }

      const order = await createOrderApi(id);
      if (!order?.orderId || !order?.amount) {
        toast.error("Unable to create payment order");
        return;
      }

      setCheckoutOpened(true);

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Kodemates",
        description: order.courseName || "Course Purchase",
        image: order.thumbnail || "/Images/logo2.png",
        order_id: order.orderId,
        prefill: {
          name: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
          email: user?.email || "",
          contact: user?.mobile || user?.contactNumber || "",
        },
        theme: {
          color: "#2563eb",
        },
        handler: async (response) => {
          try {
            await verifyRazorpayPaymentApi({
              courseId: id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            await dispatch(fetchEnrolledCourses());
            toast.success("Payment successful. Course unlocked.");
            navigate(`/dashboard/student/learn/${id}`);
          } catch (verifyError) {
            toast.error(verifyError.message || "Payment verification failed");
          } finally {
            setCheckoutOpened(false);
          }
        },
        modal: {
          ondismiss: () => {
            setCheckoutOpened(false);
            setIsPaying(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (paymentError) => {
        setCheckoutOpened(false);
        toast.error(paymentError?.error?.description || "Payment failed");
      });

      paymentObject.open();
      setIsPaying(false);
    } catch (checkoutError) {
      setCheckoutOpened(false);
      toast.error(checkoutError.message || "Unable to start checkout");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <DashboardLayout title="Course Details">
      {loading || !singleCourse ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading course...</p>
        </div>
      ) : (
        <CourseDetail
          course={singleCourse}
          showLockedPreview={!isEnrolled}
          ctaSlot={
            isEnrolled ? (
              <button
                onClick={() => navigate(`/dashboard/student/learn/${id}`)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Go To Course
              </button>
            ) : (
              <button
                onClick={handleBuy}
                disabled={isPaying || checkoutOpened}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
              >
                {checkoutOpened ? "Checkout Open" : isPaying ? "Opening checkout..." : "Buy Course"}
              </button>
            )
          }
        />
      )}
    </DashboardLayout>
  );
};

export default StudentCourseDetailsPage;
