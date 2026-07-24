const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
    trim: true,
  },
  subsections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection", // SubSection model reference
    },
  ],
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course", // Refers back to Course model
  },
});

const Section = mongoose.model("Section", SectionSchema);
module.exports = Section;
