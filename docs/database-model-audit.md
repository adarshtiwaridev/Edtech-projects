# Kodemates EdTech MongoDB Schema & Model Audit

Recursive analysis of all 21 Mongoose models in the Kodemates EdTech platform.

---

## Mongoose Schemas Overview

```text
User ─── Profile
  │
  ├── Course ─── Section ─── SubSection
  │      │
  │      ├── Categories
  │      └── RatingAndReview
  │
  ├── CourseProgress
  ├── QuizAttempt ─── Quiz ─── QuizQuestion
  ├── Certificate
  ├── StudentStreak
  ├── StudentSession
  ├── StudentResume
  ├── StudentPreferences
  └── DiscussionQuestion
```

---

## Model Audit Details

### 1. `User` (`models/User.js`)
- **Purpose:** Core identity, credential management, role definition.
- **Fields:** `firstName`, `lastName`, `email` (unique, lowercase), `password`, `accountType` (`Student`, `Teacher`, `Admin`), `profileDetails` (`ref: "Profile"`), `courses` (`[ref: "Course"]`), `courseProgress` (`[ref: "CourseProgress"]`), `image`, `token`, `resetPasswordExpires`.
- **Validation:** Unique email, enum accountType.
- **Performance:** Frequently queried on login and auth verification. Needs `{ email: 1 }` index (enforced by unique: true).

### 2. `Profile` (`models/Profile.js`)
- **Purpose:** Extended user profile info.
- **Fields:** `gender`, `dateOfBirth`, `about`, `contactNumber`.

### 3. `Course` (`models/Course.js`)
- **Purpose:** Course catalog, pricing, structure.
- **Fields:** `courseName`, `courseDescription`, `instructor` (`ref: "User"`), `whatYouWillLearn`, `courseContent` (`[ref: "Section"]`), `ratingAndReviews` (`[ref: "RatingAndReview"]`), `price`, `thumbnail`, `category` (`ref: "Category"`), `tag` (`[String]`), `status` (`Draft`, `Published`), `studentsEnrolled` (`[ref: "User"]`).

### 4. `Section` (`models/Section.js`) & `SubSection` (`models/SubSection.js`)
- **Purpose:** Modular curriculum sections and video lecture units.
- **Fields:** `sectionName`, `subsections` (`[ref: "SubSection"]`), `courseId` (`ref: "Course"`).

### 5. `Quiz`, `QuizQuestion`, `QuizAttempt` (`models/Quiz*.js`)
- **Purpose:** Dynamic quiz engine with automated scoring.
- **Fields:** `title`, `durationMinutes`, `passingMarks`, `negativeMarkingEnabled`, `perWrongAnswer`, `questions` (`[ref: "QuizQuestion"]`).
- **Attempts:** `quizId`, `studentId`, `score`, `percentage`, `passed`, `startedAt`, `completedAt`.

### 6. `Certificate` (`models/Certificate.js`)
- **Purpose:** Automated PDF certificate verification.
- **Fields:** `user` (`ref: "User"`), `course` (`ref: "Course"`), `verificationId` (unique UUID), `issueDate`, `pdfUrl`.

### 7. `StudentSession` (`models/StudentSession.js`)
- **Purpose:** Active multi-device login tracking.
- **Fields:** `studentId`, `ip`, `userAgent`, `browser`, `os`, `deviceType`, `location`, `refreshToken`, `isActive`.

---

## Query Optimization & Compound Indexes Recommendations

| Collection | Compound Index | Target Query |
| :--- | :--- | :--- |
| `QuizAttempt` | `{ studentId: 1, quizId: 1 }` | Fast lookup of student quiz attempt history |
| `CourseProgress` | `{ userID: 1, courseID: 1 }` | Unique constraint + progress lookup |
| `StudentSession` | `{ studentId: 1, isActive: 1 }` | Fast session lookup on token refresh |
| `DiscussionQuestion` | `{ courseId: 1, createdAt: -1 }` | Optimizes community forum feed queries |
