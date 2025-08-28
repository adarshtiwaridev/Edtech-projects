const profile =require("../Models/Profile");
const user =require("../Models/User");

//  update profile
exports.updateProfile = async (req, res) => {
    try {
        //get data from req body
           
        const { dateOfBirth="",contactNumber,gender,about=""} =req.body;
      

        //get user id from req.user
         const id = req.user.id;
        console.log(id);

        //validate data
        if(!dateOfBirth || !contactNumber || !gender){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }   
        //find profile by user id and update
        const userDetails = await profile.findById(id);
        const profileid=userDetails.additionalDetails;
         const profileDetails =await profile.findById(profileid);
            if(!profileDetails){
                return res.status(404).json({
                    success:false,
                    message:"Profile not found"
                });
            }
            profileDetails.dateOfBirth=dateOfBirth;
            profileDetails.contactNumber=contactNumber;     
            profileDetails.gender=gender;
            profileDetails.about=about;
            // save profile
            await profileDetails.save();
        //return response
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            data:profileDetails
        });
     
    } catch (error) {
        
        console.error("Error updating profile:", error.message);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while updating the profile",
            error:error.message
        });
    }
}

// delete account

exports.deleteAccount = async (req, res) => {
    try {
        //get user id from req.user
         const id = req.user.id;
        console.log(id);

        //find user by id and delete
        const userDetails = await user.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        const profileid=userDetails.additionalDetails;
        await profile.findByIdAndDelete(profileid);
        await user.findByIdAndDelete(id);
        // also delete all the courses created by the user
        await course.deleteMany({ createdBy: id });
        //return response
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully"
        });
     
    } catch (error) {
        
        console.error("Error deleting account:", error.message);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while deleting the account",
            error:error.message
        });
    }
}


// get profile details
exports.getUserDetails = async (req, res) => {
    try {
        //get user id from req.user
         const id = req.user.id;
        console.log(id);

        //find user by id and get profile details
        const userDetails = await user.findById(id).populate("additionalDetails").exec();
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        const profileid=userDetails.additionalDetails;
        const profileDetails =await profile.findById(profileid);
            if(!profileDetails){
                return res.status(404).json({
                    success:false,
                    message:"Profile not found"
                });
            }
        //return response
        return res.status(200).json({
            success:true,
            message:"Profile details fetched successfully",
            data:profileDetails
        });
     
    } catch (error) {
        
        console.error("Error fetching profile details:", error.message);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while fetching the profile details",
            error:error.message
        });
    }
} 

// get all user details
exports.getAllUserDetails = async (req, res) => {
    try {
        //get all users
    
         const users = await user.find().populate("additionalDetails").exec();
        if(!users){
            return res.status(404).json({
                success:false,
                message:"No users found"
            });
        }
        //return response
        return res.status(200).json({
            success:true,
            message:"All user details fetched successfully ",
            data:users
        });
     
    } catch (error) {
        
        console.error("Error fetching all user details:", error.message);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while fetching all user details",
            error:error.message
        });
    }
}
// ADD THIS: get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const userDetails = await user.findById(userId).populate("courses").exec();
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Enrolled courses fetched successfully",
            data: userDetails.courses,
        });
    } catch (error) {
        console.error("Error fetching enrolled courses:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching enrolled courses",
            error: error.message,
        });
    }
};

// ADD THIS: update display picture
// ADD THIS: get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const userDetails = await user.findById(userId).populate("courses").exec();
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Enrolled courses fetched successfully",
            data: userDetails.courses,
        });
    } catch (error) {
        console.error("Error fetching enrolled courses:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching enrolled courses",
            error: error.message,
        });
    }
};