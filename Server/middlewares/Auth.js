
const jwt =require("jsonwebtoken");
require("dotenv").config();
const User=require("../Models/User")


 //Auth concept 
 exports.auth=async(req,res ,next) =>{
 try {
    // extract token 
    const token=req.body.token ||req.cookies.token || req.header("Authorization").replace("bearer"," ");
      
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        //  Verify token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload; // Correct: use decoded payload here
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        next(); //  Continue to next middleware
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
 } catch (error) {
    
 }
 }

//isStudent
//isTeacher