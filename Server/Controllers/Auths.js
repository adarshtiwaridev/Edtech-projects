// otp verification

const User = require("../Models/User");
const Otp = require("../Models/Otp");
const otpGenerator = require("otp-generator");
const { customAlphabet } = require('nanoid');
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // check user already exist 
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists"
      });
    }

const generateOTP = customAlphabet('1234567890', 6); 
const otp = generateOTP(); 
console.log("otp",otp);
const otpPayload = { email, otp };
const otpBody=await otp.create(otpPayload)
  console.log(otpBody);
//return response successful
res.status(200).json({
    success:true ,
    message:"Otp Send successfully",
    otp,
})

  } catch (error) {
    return res.status(401).json({
        success:false,
        message:"OTP failed "
    })
    console.log(error);
  }
};



// signup validate 
exports.Signup = async (req,res) =>
    {

    //data fetch from body 

   const {
    firstName,lastname,
    email,mobile,
    password,
    confirmPassword,
    accountType,
    otp
   } = req.body;

    //valiade kr lo 

    if ( !firstName || !lastname|| !email|| !mobile||!password || !confirmPassword ||!otp) {
      return res.status(403).json({
        success:false,
        message:"All Inputs are required ",
      })
      
    }
    //2 passwaord match kr lo 
    if (password !=confirmPassword) {
      return res.status(403).json({
        success:false,
        message:"Password &Confirmpassword  does not match the value  ,please try again",

      })
      
    }
    //cheack if user already exits 
     const existUser =await User.findOne({email});
     if (existUser) {
     return res.status(400).json({
      success:false,
      message:"user already exist"
     })  

     }

    // find most recent otp soort karna padega 
    const recentOtp = await Otp.findOne({email}).sort({createdAt:-1}).limit(1);

    //validate otp 

    if (recentOtp.length==0) {
      return res.status(400).json({
        success:false,
        message:"Otp not found please try again"
      })
      
    }
    //Invalid otp 
    elseif(otp !==recentOtp.otp)
    {

      return res.status(400),json({
        success:false,
        message:"Invalid otp",
      })
    }



    //hash password
    
    const hashed=await bc

    //centry creted in db 
    //return res


}

//login
//changePassword

