# Kodemates EdTech Database Architecture & Indexing Guide

Overview of database schema design, entity-relationship patterns, compound indexes, and query optimizations for MongoDB Atlas.

---

## 1. Entity-Relationship Overview

```text
User (1) ───< Profile (1)
  │
  ├───< Course (N) ───< Section (N) ───< SubSection (N)
  │       │
  │       ├───< Category (1)
  │       └───< RatingAndReview (N)
  │
  ├───< CourseProgress (N)
  ├───< QuizAttempt (N) ───< Quiz (1) ───< QuizQuestion (N)
  ├───< Certificate (N)
  ├───< StudentSession (N)
  ├───< StudentStreak (1)
  ├───< StudentResume (1)
  ├───< StudentPreferences (1)
  └───< DiscussionQuestion (N)
```

---

## 2. Model Audit & Primary Fields

### `User` (`models/User.js`)
- Primary identity collection storing `firstName`, `lastName`, `email` (unique index), `password` (bcrypt hash), `accountType` (`Student`, `Teacher`, `Admin`), `profileDetails` (ref: `Profile`), `courses` (ref array: `Course`), `courseProgress` (ref array: `CourseProgress`), `status` (`Approved`, `Pending`, `Suspended`).

### `CourseProgress` (`models/CourseProgress.js`)
- Progress tracking collection storing `userId` (ref: `User`), `courseID` (ref: `Course`), `completedVideos` (array of `SubSection` ObjectIds).
- Recommended Compound Index: `{ userId: 1, courseID: 1 }` (unique constraint preventing duplicate progress records).

### `StudentSession` (`models/StudentSession.js`)
- Active session tracking collection storing `userId` (ref: `User`), `sessionToken`, `ipAddress`, `userAgent`, `browser`, `os`, `deviceType`, `location`, `status` (`Active`, `Terminated`), `isCurrent`.
- Recommended Compound Index: `{ userId: 1, isActive: 1 }` (accelerates active session retrieval).

### `QuizAttempt` (`models/QuizAttempt.js`)
- Assessment attempt history storing `quizId` (ref: `Quiz`), `studentId` (ref: `User`), `score`, `percentage`, `passed`, `answers`, `startedAt`, `completedAt`.
- Recommended Compound Index: `{ studentId: 1, quizId: 1 }` (optimizes student attempt history lookups).

### `DiscussionQuestion` (`models/DiscussionQuestion.js`)
- Community forum feed storing `courseId` (ref: `Course`), `subSectionId`, `user` (ref: `User`), `title`, `body`, `upvotes`, `answers`.
- Recommended Compound Index: `{ courseId: 1, createdAt: -1 }` (optimizes forum feed queries).

---

## 3. Query Performance Best Practices
- Use `.lean()` for read-only query pipelines to skip heavy Mongoose Document instantiation.
- Use explicit projection `.select("firstName lastName email accountType")` to avoid pulling unnecessary subdocuments.
- Cap pagination results with `.limit(pageSize)` and `.skip((page - 1) * pageSize)` to prevent unbounded document fetches.
