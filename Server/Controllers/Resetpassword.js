const User =require("../Models/User");
const sendEmail = require("../utlis/Sendemails");
const mailsender=require("../utlis/Sendemails")
require("dotenv").config();
const bcrypt =require("bcrypt");
const crypto = require("crypto");

// generate reset password token
  exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    // check user
    const existuser = await User.findOne({ email });
    if (!existuser) {
      return res.status(404).json({
        success: false,
        message: "Your email is not registered with us",
      });
    }

    // generate token
    const token = crypto.randomUUID();

    // update user with token & expiry
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 min expiry
      },
      { new: true }
    );

    // frontend reset URL
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail
    await sendEmail(
      email,
      "Password Reset Link",
      `Password reset URL link: ${url}`
    );

    return res.json({
      success: true,
      message: "Password reset link sent successfully. Please check your email.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some error occurred in reset password",
    });
  }
};



// reset password
    exports.resetPassword =async(req,res)=>{
    try {
        //data fetch
        const {password ,confirmPassword ,token}=req.body
        //validatiom
        if (!password || !confirmPassword) {
            return res.status(400).json({
                success:false,
                message:"All inputs are required ",
            })

        }
        if (password !==confirmPassword) {
            return res.status(400).json({
                success:false,
                message:"password do not match",
            });

        }
        //get user details form db by using token
        const UserDetails=await User.findOne({token:token});
        //if no token is found

        if (!UserDetails) {
            return res.status(400).json({
                success:false,
                message:"token invalid "
            });

        }
        //cheack token expires
        if (UserDetails.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
    success:false,
    message:"YOUR token is expires  kindly regenrates"
            })

        }
        //hashed password
        const updatePassword=await bcrypt.hash(password,10)
        //password update
        await User.findOneAndUpdate({token:token},{password:updatePassword} ,{new:true});
    // return res
    return res.status(200).json({
        success:true,
        message:"Passoword update succesfully"
    })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something error while updating kindly refresh it "
        })

    }
    }