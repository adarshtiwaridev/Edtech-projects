import { describe, it, expect } from "vitest";

describe("RoleGuard & Protected Navigation Rules Unit Tests", () => {
  const isRoleAllowed = (currentRole, allowedRoles = []) => {
    if (!currentRole) return false;
    if (currentRole === "Admin") return true;
    if (allowedRoles.length === 0) return true;
    return allowedRoles.includes(currentRole);
  };

  it("1. Admin role should be allowed across all restricted routes", () => {
    expect(isRoleAllowed("Admin", ["Teacher"])).toBe(true);
    expect(isRoleAllowed("Admin", ["Student"])).toBe(true);
    expect(isRoleAllowed("Admin", ["Admin"])).toBe(true);
  });

  it("2. Student role should be denied access to Teacher or Admin routes", () => {
    expect(isRoleAllowed("Student", ["Teacher", "Instructor"])).toBe(false);
    expect(isRoleAllowed("Student", ["Admin"])).toBe(false);
  });

  it("3. Teacher role should be allowed on Teacher routes but denied on Admin routes", () => {
    expect(isRoleAllowed("Teacher", ["Teacher", "Instructor"])).toBe(true);
    expect(isRoleAllowed("Teacher", ["Admin"])).toBe(false);
  });

  it("4. Unauthenticated user (null role) should be denied access across all protected routes", () => {
    expect(isRoleAllowed(null, ["Student"])).toBe(false);
    expect(isRoleAllowed(undefined, ["Teacher"])).toBe(false);
  });
});
