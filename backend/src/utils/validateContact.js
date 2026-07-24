// Validation utilities for contact form

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateContactForm = (data) => {
  const errors = {};

  // Name validation
  if (!data.name || !data.name.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (data.name.trim().length > 100) {
    errors.name = "Name must not exceed 100 characters";
  }

  // Email validation
  if (!data.email || !data.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email.trim())) {
    errors.email = "Invalid email format";
  } else if (data.email.trim().length > 255) {
    errors.email = "Email must not exceed 255 characters";
  }

  // Subject validation
  if (!data.subject || !data.subject.trim()) {
    errors.subject = "Subject is required";
  } else if (data.subject.trim().length < 5) {
    errors.subject = "Subject must be at least 5 characters";
  } else if (data.subject.trim().length > 200) {
    errors.subject = "Subject must not exceed 200 characters";
  }

  // Message validation
  if (!data.message || !data.message.trim()) {
    errors.message = "Message is required";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  } else if (data.message.trim().length > 5000) {
    errors.message = "Message must not exceed 5000 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Sanitize string inputs to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ""); // Remove event handlers
};

// Sanitize all contact data
const sanitizeContactData = (data) => {
  return {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email),
    subject: sanitizeInput(data.subject),
    message: sanitizeInput(data.message),
  };
};

module.exports = {
  validateEmail,
  validateContactForm,
  sanitizeInput,
  sanitizeContactData,
};
