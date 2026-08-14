const asyncHandler = require("express-async-handler");
const DiscussionQuestion = require("../models/DiscussionQuestion");

exports.createQuestion = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { courseId, subSectionId, title, body } = req.body;

  if (!courseId || !title || !body) {
    res.status(400);
    throw new Error("courseId, title, and body are required");
  }

  const question = await DiscussionQuestion.create({
    courseId,
    subSectionId: subSectionId || null,
    user: userId,
    title,
    body,
  });

  const populated = await DiscussionQuestion.findById(question._id).populate(
    "user",
    "firstName lastName accountType profilePicture"
  );

  res.status(201).json({
    success: true,
    message: "Question posted to discussion forum!",
    data: populated,
  });
});

exports.getCourseQuestions = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId || req.query.courseId;

  if (!courseId) {
    res.status(400);
    throw new Error("courseId parameter is required");
  }

  const questions = await DiscussionQuestion.find({ courseId })
    .populate("user", "firstName lastName accountType profilePicture")
    .populate("answers.user", "firstName lastName accountType profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: questions,
  });
});

exports.addAnswer = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role || req.user.accountType || "Student";
  const { questionId } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    res.status(400);
    throw new Error("Answer text cannot be empty");
  }

  const question = await DiscussionQuestion.findById(questionId);
  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  question.answers.push({
    user: userId,
    userRole: role,
    text,
  });

  await question.save();

  const updated = await DiscussionQuestion.findById(questionId)
    .populate("user", "firstName lastName accountType profilePicture")
    .populate("answers.user", "firstName lastName accountType profilePicture");

  res.status(200).json({
    success: true,
    message: "Answer added successfully!",
    data: updated,
  });
});

exports.upvoteQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const question = await DiscussionQuestion.findByIdAndUpdate(
    questionId,
    { $inc: { upvotes: 1 } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: question,
  });
});
