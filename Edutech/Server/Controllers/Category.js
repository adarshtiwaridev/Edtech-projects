const Category = require("../Models/Categories");
const Course = require("../Models/Course");

// create a new category
exports.createCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    if (!categoryName || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      categoryName,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// show all categories
exports.showAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, { categoryName: 1, description: 1 })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    const categoryId = req.body.categoryId || req.query.categoryId;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "categoryId is required",
      });
    }

    const selectedCategory = await Category.findById(categoryId).populate({
      path: "courses",
      populate: {
        path: "instructor",
        select: "firstName lastName email",
      },
    });

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const otherCategories = await Category.find({ _id: { $ne: categoryId } })
      .select("categoryName description");

    const topSellingCourses = await Course.find({ category: categoryId })
      .sort({ studentsEnrolled: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      message: "Category page details fetched successfully",
      data: {
        selectedCategory,
        otherCategories,
        topSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};