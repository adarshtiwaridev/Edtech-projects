const { auth, student, instructor, admin } = require("../middleware/Auth");

describe("Backend Auth Middleware & Security Audit Unit Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
      body: {},
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test("auth middleware should reject requests without token with 401", () => {
    req.header.mockReturnValue(null);
    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "No token provided",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("student role guard should pass for Student role", () => {
    req.user = { role: "Student" };
    student(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("student role guard should block non-student roles with 403", () => {
    req.user = { role: "Guest" };
    student(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Student only route",
      })
    );
  });

  test("admin role guard should allow Admin role only", () => {
    req.user = { role: "Admin" };
    admin(req, res, next);
    expect(next).toHaveBeenCalled();

    next.mockClear();
    req.user = { role: "Student" };
    admin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
