const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    }],

    
});
const Categories = mongoose.model("Categories",CategoriesSchema);
module.exports = Categories;
