import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../constants/endpoints";

export const createCourseApi = async (formData) => {
  const response = await axiosInstance.post(ENDPOINTS.COURSE.CREATE_COURSE, formData);
  return response.data;
};

export const updateCourseApi = async (courseId, formData) => {
  const response = await axiosInstance.put(`${ENDPOINTS.COURSE.UPDATE_COURSE}/${courseId}`, formData);
  return response.data;
};

export const deleteCourseApi = async (courseId) => {
  const response = await axiosInstance.delete(`${ENDPOINTS.COURSE.DELETE_COURSE}/${courseId}`);
  return response.data;
};

export const fetchAllCoursesApi = async () => {
  const response = await axiosInstance.get(ENDPOINTS.COURSE.GET_ALL_COURSES);
  return response.data?.data || response.data;
};

export const fetchCourseDetailsApi = async (courseId) => {
  const response = await axiosInstance.post(ENDPOINTS.COURSE.GET_COURSE_DETAILS, { courseId });
  return response.data?.data || response.data;
};

export const createSectionApi = async (courseId, title) => {
  const response = await axiosInstance.post(ENDPOINTS.COURSE.CREATE_SECTION, { courseId, sectionName: title });
  return response.data;
};

export const updateSectionApi = async (data) => {
  const response = await axiosInstance.post(ENDPOINTS.COURSE.UPDATE_SECTION, data);
  return response.data;
};

export const deleteSectionApi = async (data) => {
  const response = await axiosInstance.post(ENDPOINTS.COURSE.DELETE_SECTION, data);
  return response.data;
};

export const createLectureApi = async (data) => {
  // Use formData for lecture video upload
  const formData = new FormData();
  if (data.sectionId) formData.append("sectionId", data.sectionId);
  if (data.title) formData.append("title", data.title);
  if (data.videoUrl) formData.append("video", data.videoUrl); // assuming videoUrl is the File object from slice
  if (data.notes) formData.append("description", data.notes);
  
  const response = await axiosInstance.post(ENDPOINTS.COURSE.CREATE_SUBSECTION, formData);
  return response.data;
};

export const updateLectureApi = async (formData) => {
  const response = await axiosInstance.post(ENDPOINTS.COURSE.UPDATE_SUBSECTION, formData);
  return response.data;
};

export const deleteLectureApi = async (data) => {
  const response = await axiosInstance.post(ENDPOINTS.COURSE.DELETE_SUBSECTION, data);
  return response.data;
};

export const createCategoryApi = async (data) => {
  const response = await axiosInstance.post(ENDPOINTS.COURSE.CREATE_CATEGORY, data);
  return response.data;
};

export const fetchCategoriesApi = async () => {
  const response = await axiosInstance.get(ENDPOINTS.COURSE.SHOW_ALL_CATEGORIES);
  return response.data?.data || response.data;
};

export const getCategoryPageDetailsApi = async (categoryId) => {
  const response = await axiosInstance.post(ENDPOINTS.COURSE.GET_CATEGORY_PAGE_DETAILS, { categoryId });
  return response.data;
};

export const createRatingApi = async (data) => {
  const response = await axiosInstance.post(ENDPOINTS.COURSE.CREATE_RATING, data);
  return response.data;
};

export const getAverageRatingApi = async (courseId) => {
  const response = await axiosInstance.get(ENDPOINTS.COURSE.GET_AVERAGE_RATING, { params: { courseId } });
  return response.data;
};

export const fetchEnrolledCoursesApi = async () => {
  const response = await axiosInstance.get(ENDPOINTS.PROFILE.GET_ENROLLED_COURSES);
  return response.data?.data || [];
};

export const createOrderApi = async (courseId) => {
  const response = await axiosInstance.post(ENDPOINTS.PAYMENT.CAPTURE_PAYMENT, { courses: [courseId] });
  return response.data;
};

export const getRazorpayKeyApi = async () => {
  const response = await axiosInstance.get(ENDPOINTS.PAYMENT.GET_RAZORPAY_KEY);
  return response.data;
};

export const verifyRazorpayPaymentApi = async (data) => {
  const response = await axiosInstance.post(ENDPOINTS.PAYMENT.VERIFY_PAYMENT, data);
  return response.data;
};

export const filterTeacherCourses = (courses, teacherId) => {
  if (!courses || !Array.isArray(courses)) return [];
  // Assumes course.instructor is either an ID string or an object with _id
  return courses.filter((course) => {
    const instId = course.instructor?._id || course.instructor;
    return instId === teacherId;
  });
};

export const courseService = {
  createCourse: createCourseApi,
  updateCourse: updateCourseApi,
  deleteCourse: deleteCourseApi,
  getAllCourses: fetchAllCoursesApi,
  getCourseDetails: fetchCourseDetailsApi,
  createSection: createSectionApi,
  updateSection: updateSectionApi,
  deleteSection: deleteSectionApi,
  createSubSection: createLectureApi,
  updateSubSection: updateLectureApi,
  deleteSubSection: deleteLectureApi,
  createCategory: createCategoryApi,
  showAllCategories: fetchCategoriesApi,
  getCategoryPageDetails: getCategoryPageDetailsApi,
  createRating: createRatingApi,
  getAverageRating: getAverageRatingApi,
  getRazorpayKey: getRazorpayKeyApi,
  verifyRazorpayPayment: verifyRazorpayPaymentApi,
};
