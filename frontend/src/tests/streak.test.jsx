import { describe, it, expect } from "vitest";

describe("Frontend Streak & Gamification Logic Unit Tests", () => {
  it("should calculate student level correctly based on total XP", () => {
    const calculateLevel = (totalXp) => Math.floor(totalXp / 1000) + 1;

    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(850)).toBe(1);
    expect(calculateLevel(1200)).toBe(2);
    expect(calculateLevel(4500)).toBe(5);
  });

  it("should calculate weekly goal completion percentage safely", () => {
    const calcGoalPercentage = (completed, target) => {
      if (!target || target <= 0) return 0;
      return Math.min(100, Math.round((completed / target) * 100));
    };

    expect(calcGoalPercentage(5, 10)).toBe(50);
    expect(calcGoalPercentage(12, 10)).toBe(100);
    expect(calcGoalPercentage(0, 10)).toBe(0);
  });
});
