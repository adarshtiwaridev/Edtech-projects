const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    if (!envUrl || envUrl.includes("onrender.com")) {
      return "http://localhost:5000/api";
    }
  }
  return envUrl || "https://kodemates-2.onrender.com/api";
};

export const API_URL = getBaseUrl();

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/users/login",
    SIGNUP: "/users/signup",
    SEND_OTP: "/users/sendotp",
    VERIFY_OTP: "/users/verify-otp",
    LOGOUT: "/users/logout",
    CONTACT_US: "/users/contactus",
    DELETE_ACCOUNT: "/users/deleteAccount",
    CHANGE_PASSWORD: "/users/changePassword",
    RESET_PASSWORD_TOKEN: "/users/resetPasswordToken",
    RESET_PASSWORD: "/users/resetPassword",
  },
  PROFILE: {
    GET_USER_DETAILS: "/profiles/getUserDetails",
    GET_ALL_USER_DETAILS: "/profiles/getAllUserDetails",
    UPDATE_PROFILE: "/profiles/updateProfile",
    UPDATE_DISPLAY_PICTURE: "/profiles/updateDisplayPicture",
    GET_ENROLLED_COURSES: "/profiles/getEnrolledCourses",
    DELETE_ACCOUNT: "/profiles/deleteAccount",
  },
  COURSE: {
    CREATE_COURSE: "/courses/createCourse",
    UPDATE_COURSE: "/courses/updateCourse",
    DELETE_COURSE: "/courses/deleteCourse",
    GET_ALL_COURSES: "/courses/getAllCourses",
    GET_COURSE_DETAILS: "/courses/getCourseDetails",
    CREATE_SECTION: "/courses/createSection",
    UPDATE_SECTION: "/courses/updateSection",
    DELETE_SECTION: "/courses/deleteSection",
    CREATE_SUBSECTION: "/courses/createSubSection",
    UPDATE_SUBSECTION: "/courses/updateSubSection",
    DELETE_SUBSECTION: "/courses/deleteSubSection",
    CREATE_CATEGORY: "/courses/createCategory",
    SHOW_ALL_CATEGORIES: "/courses/showAllCategories",
    GET_CATEGORY_PAGE_DETAILS: "/courses/getCategoryPageDetails",
    CREATE_RATING: "/courses/createRating",
    GET_AVERAGE_RATING: "/courses/getAverageRating",
    UPDATE_COURSE_PROGRESS: "/courses/updateCourseProgress",
    GET_COURSE_PROGRESS: "/courses/getCourseProgress",
  },
  PAYMENT: {
    GET_RAZORPAY_KEY: "/payment/getRazorpayKey",
    CAPTURE_PAYMENT: "/payment/capturePayment",
    VERIFY_PAYMENT: "/payment/verifyPayment",
    VERIFY_SIGNATURE: "/payment/verifySignature",
  },
};
