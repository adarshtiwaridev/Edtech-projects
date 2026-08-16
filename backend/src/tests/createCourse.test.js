const { createCourse } = require("../controllers/Course");

describe("Course Creation API End-to-End & Boundary Resilience Tests", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      files: null,
      user: {
        id: "507f1f77bcf86cd799439011",
        _id: "507f1f77bcf86cd799439011",
        role: "Teacher",
        accountType: "Teacher",
        email: "teacher@kodemates.com",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  test("Should return 400 Bad Request when title or description is missing", async () => {
    req.body = {
      title: "",
      description: "",
    };

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Course title and description are required",
      })
    );
  });

  test("Should handle course creation with default fallbacks without throwing 500", async () => {
    req.body = {
      title: "Mastering React 19 & Next.js 15",
      description: "Full stack production application architecture",
      price: 499,
      level: "Intermediate",
    };

    const User = require("../models/User");
    const Course = require("../models/Course");
    const Category = require("../models/Categories");

    jest.spyOn(User, "findById").mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      firstName: "Alex",
      lastName: "Dev",
      accountType: "Teacher",
    });

    jest.spyOn(Category, "findById").mockResolvedValue(null);
    jest.spyOn(Category, "findOne").mockResolvedValue({
      _id: "507f1f77bcf86cd799439012",
      categoryName: "Web Development",
    });

    const mockCreatedCourse = {
      _id: "507f1f77bcf86cd799439013",
      courseName: req.body.title,
      courseDescription: req.body.description,
      price: 499,
    };

    jest.spyOn(Course, "create").mockResolvedValue(mockCreatedCourse);
    jest.spyOn(Course, "findById").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockCreatedCourse),
          }),
        }),
      }),
    });

    jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue(true);
    jest.spyOn(Category, "findByIdAndUpdate").mockResolvedValue(true);

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Course created successfully! 🚀",
      })
    );
  });
});
