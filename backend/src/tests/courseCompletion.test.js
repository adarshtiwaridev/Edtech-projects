const StudentService = require("../services/StudentService");

describe("Student Streak & Course Completion Logic Tests", () => {
  test("StudentService.logActivity should calculate streak continuation correctly", async () => {
    // Mock StudentStreak Mongoose Model
    const mockStreak = {
      userId: "user_123",
      currentStreak: 2,
      longestStreak: 5,
      totalStudyMinutes: 100,
      totalXp: 500,
      level: 1,
      coins: 10,
      badges: [],
      achievements: [],
      lastActiveDate: "2026-08-15",
      activityLogs: [],
      save: jest.fn().mockResolvedValue(true),
    };

    const StudentStreak = require("../models/StudentStreak");
    jest.spyOn(StudentStreak, "findOne").mockResolvedValue(mockStreak);

    const updated = await StudentService.logActivity("user_123", {
      minutes: 30,
      lecturesCount: 1,
      quizzesCount: 0,
    });

    expect(updated.totalStudyMinutes).toBe(130);
    expect(updated.save).toHaveBeenCalled();
  });
});
