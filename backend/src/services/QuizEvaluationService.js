const QuizQuestion = require("../models/QuizQuestion");

/**
 * Evaluates student submitted answers against question keys and generates performance analytics.
 * @param {Object} quiz - Quiz configuration model
 * @param {Array} userAnswers - Array of { questionId, selectedAnswer, timeSpentSeconds }
 * @returns {Object} Evaluation summary (score, percentage, accuracy, topic breakdown, AI report)
 */
async function evaluateQuizSubmission(quiz, userAnswers = []) {
  const questions = await QuizQuestion.find({ quizId: quiz._id });
  const questionMap = new Map();
  questions.forEach((q) => questionMap.set(q._id.toString(), q));

  let totalScore = 0;
  let totalPossibleMarks = 0;
  let correctCount = 0;
  let totalAttempted = userAnswers.length;

  const topicStats = {};
  const processedAnswers = [];

  questions.forEach((q) => {
    totalPossibleMarks += q.marks || 10;
    const topic = q.topic || "General";
    if (!topicStats[topic]) {
      topicStats[topic] = { total: 0, correct: 0 };
    }
    topicStats[topic].total += 1;
  });

  for (const ans of userAnswers) {
    const qId = ans.questionId?.toString();
    const q = questionMap.get(qId);
    if (!q) continue;

    const topic = q.topic || "General";
    let isCorrect = false;
    let marksAwarded = 0;

    if (q.questionType === "numerical" || q.questionType === "fill_blank") {
      isCorrect =
        String(ans.selectedAnswer).trim().toLowerCase() ===
        String(q.correctAnswer).trim().toLowerCase();
    } else {
      isCorrect = Number(ans.selectedAnswer) === Number(q.correctAnswer);
    }

    if (isCorrect) {
      marksAwarded = q.marks || 10;
      correctCount += 1;
      if (topicStats[topic]) topicStats[topic].correct += 1;
    } else if (quiz.negativeMarking?.enabled) {
      marksAwarded = -(q.negativeMarks || quiz.negativeMarking.perWrongAnswer || 0.25);
    }

    totalScore += marksAwarded;

    processedAnswers.push({
      questionId: q._id,
      selectedAnswer: ans.selectedAnswer,
      isCorrect,
      marksAwarded,
      timeSpentSeconds: ans.timeSpentSeconds || 0,
    });
  }

  // Prevent negative total scores
  totalScore = Math.max(0, totalScore);

  const percentage = Math.round((totalScore / (totalPossibleMarks || 1)) * 100);
  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
  const passed = percentage >= (quiz.passingMarks || 40);

  // Generate Topic Strengths & Weaknesses
  const strengths = [];
  const weaknesses = [];

  Object.entries(topicStats).forEach(([top, stat]) => {
    const acc = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
    if (acc >= 70) {
      strengths.push(top);
    } else {
      weaknesses.push(top);
    }
  });

  const summary = passed
    ? `Congratulations! You scored ${percentage}% with ${accuracy}% accuracy. Strong domain mastery shown.`
    : `Score: ${percentage}%. Recommended review on weak topics to meet the ${quiz.passingMarks}% passing threshold.`;

  return {
    processedAnswers,
    totalScore,
    percentage,
    accuracy,
    passed,
    aiPerformanceReport: {
      summary,
      strengths: strengths.length > 0 ? strengths : ["Basic Problem Solving"],
      weaknesses: weaknesses.length > 0 ? weaknesses : ["Speed & Time Optimization"],
      recommendedTopics: weaknesses.length > 0 ? weaknesses : ["Advanced Algorithm Patterns"],
    },
  };
}

module.exports = {
  evaluateQuizSubmission,
};
