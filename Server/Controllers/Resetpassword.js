const User =require("../Models/User")
const mailsender=require("../utlis/Sendemails")
require("dotenv").config();
const bcrypt =require("bcrypt");
const crypto = require("crypto");

//reset password
exports.resetPasswordToken=async(req,res)=>{

    try {
          //get email from request body
    const {email}=req.body;


    //cheack user  for this email,email validation

    const existuser=await User.findOne({email});
    if (!existuser) {
        return res.status(404).json ({
    success:false,
    message:"Your email does not register with us "
        })

    }

    //genrate token
    const token=crypto.randomUUID();
    // update user by adding token and expirationtime
    const updatedetails=await User.findByIdAndUpdate({email:email},{
        token:token,
        resetPasswordExpires:Date.now() +5*60*1000,
    },
{new:true})// isme new update document send hota hai
    //send url on mail
    const url=`https://localhost:3000/update-password/${token}`

    await mailsender(email,"password reset link" , "password reset url link:  ${url}");
    //return response
    return res.json({
        success:true,
        message:"Password changed succesfully"
    })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success:false,
        message:"some error in reset password"
      })
    }
}


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
    await User.findByIdAndUpdate({token:token},{password:updatePassword} ,{new:true});
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