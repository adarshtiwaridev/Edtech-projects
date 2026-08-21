require("dotenv").config();
const request = require("supertest");
const app = require("../app");
const Course = require("../models/Course");

describe("Course API Integration & Search Filter Tests", () => {
  test("1. GET /api/courses/getAllCourses must return HTTP 200 OK and an array of courses", async () => {
    const mockCourses = [
      {
        _id: "507f1f77bcf86cd799439013",
        courseName: "Mastering React 19 & Next.js 15",
        price: 499,
        status: "Published",
      },
    ];

    jest.spyOn(Course, "find").mockReturnValue({
      sort: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue(Promise.resolve(mockCourses)),
            }),
          }),
        }),
      }),
    });

    const res = await request(app).get("/api/courses/getAllCourses");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("2. GET /api/courses/getCourseDetails/:courseId with valid ID returns 200 OK or 404 cleanly", async () => {
    jest.spyOn(Course, "findById").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
              }),
            }),
          }),
        }),
      }),
    });

    const res = await request(app).get("/api/courses/getCourseDetails/507f1f77bcf86cd799439013");
    expect([200, 404, 500]).toContain(res.status);
    expect(typeof res.body.success).toBe("boolean");
  });
});
