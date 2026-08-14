import apiClient, { getWithFallback, postWithFallback, putWithFallback, deleteWithFallback } from "./apiClient";

export const getStudentOverview = async () => {
  const paths = ["/v1/student/dashboard/overview", "/student/dashboard/overview"];
  return await getWithFallback(paths);
};

export const getLoginSessions = async () => {
  const paths = ["/v1/student/security/sessions", "/student/security/sessions"];
  return await getWithFallback(paths);
};

export const terminateLoginSession = async (sessionId) => {
  const paths = [`/v1/student/security/sessions/${sessionId}`, `/student/security/sessions/${sessionId}`];
  return await deleteWithFallback(paths);
};

export const logStudyActivity = async (activityData) => {
  const paths = ["/v1/student/streak/log", "/student/streak/log"];
  return await postWithFallback(paths, activityData);
};

export const recoverStudentStreak = async () => {
  const paths = ["/v1/student/streak/recover", "/student/streak/recover"];
  return await postWithFallback(paths, {});
};

export const getStudentAnalytics = async () => {
  const paths = ["/v1/student/analytics", "/student/analytics"];
  return await getWithFallback(paths);
};

export const getStudentResume = async () => {
  const paths = ["/v1/student/resume", "/student/resume"];
  return await getWithFallback(paths);
};

export const updateStudentResume = async (resumeData) => {
  const paths = ["/v1/student/resume", "/student/resume"];
  return await putWithFallback(paths, resumeData);
};

export const getStudentNotifications = async () => {
  const paths = ["/v1/student/notifications", "/student/notifications"];
  return await getWithFallback(paths);
};

export const markNotificationRead = async (notifId) => {
  return await apiClient.patch(`/v1/student/notifications/${notifId}/read`);
};

export const getStudentPreferences = async () => {
  const paths = ["/v1/student/preferences", "/student/preferences"];
  return await getWithFallback(paths);
};

export const updateStudentPreferences = async (prefData) => {
  const paths = ["/v1/student/preferences", "/student/preferences"];
  return await putWithFallback(paths, prefData);
};
