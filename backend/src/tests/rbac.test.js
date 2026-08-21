require("dotenv").config();
const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

describe("RBAC & Security Route Protection Integration Tests", () => {
  const secret = process.env.JWT_SECRET || "super_secret_jwt_key_change_in_production";

  const studentToken = jwt.sign(
    { id: "507f1f77bcf86cd799439011", email: "student@kodemates.com", accountType: "Student", role: "Student" },
    secret,
    { expiresIn: "1h" }
  );

  test("1. Unauthenticated request to DELETE /api/users/deleteAccount must return 401 Unauthorized", async () => {
    const res = await request(app).delete("/api/users/deleteAccount");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("2. Student role accessing Admin Dashboard endpoint GET /api/admin/dashboard-stats must return 403 Forbidden", async () => {
    const res = await request(app)
      .get("/api/admin/dashboard-stats")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test("3. Student role attempting to create course POST /api/courses/createCourse must return 403 Forbidden", async () => {
    const res = await request(app)
      .post("/api/courses/createCourse")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        title: "Unauthorized Course",
        description: "Attempting student course creation",
      });
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test("4. Unauthenticated request to GET /api/profiles/getUserDetails must return 401 Unauthorized", async () => {
    const res = await request(app).get("/api/profiles/getUserDetails");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("5. Health check GET /api/health should be publicly accessible and return HTTP 200 OK", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
