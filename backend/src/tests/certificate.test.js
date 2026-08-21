require("dotenv").config();
const request = require("supertest");
const app = require("../app");
const Certificate = require("../models/Certificate");

describe("Certificate Verification API Integration Tests", () => {
  test("1. GET /api/v1/enhanced/certificates/verify/:verificationId with unknown UUID returns 404 Not Found", async () => {
    jest.spyOn(Certificate, "findOne").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue(Promise.resolve(null)),
      }),
    });

    const res = await request(app).get("/api/v1/enhanced/certificates/verify/non-existent-uuid-1234");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid or unverified certificate id/i);
  });

  test("2. GET /api/v1/enhanced/certificates/verify/:verificationId with valid UUID returns certificate details", async () => {
    const mockCert = {
      verificationId: "valid-uuid-5678",
      issueDate: new Date(),
      userId: { firstName: "Jane", lastName: "Doe" },
      courseId: { courseName: "Full Stack MERN Architecture" },
    };

    jest.spyOn(Certificate, "findOne").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue(Promise.resolve(mockCert)),
      }),
    });

    const res = await request(app).get("/api/v1/enhanced/certificates/verify/valid-uuid-5678");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verificationId).toBe("valid-uuid-5678");
  });
});
