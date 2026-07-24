const mongoose = require("mongoose");

const RatingAndReviewSchema = new mongoose.Schema({
  
      User:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" 
    },
    rating: {
        type: Number,   
        required: true,
    },
    review: {
        type: String,
        required: true,
        trim: true
    },
   


    
});
const RatingAndReview = mongoose.model("RatingAndReview", RatingAndReviewSchema);
module.exports = RatingAndReview;
