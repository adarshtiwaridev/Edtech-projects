const Section = require("../Models/Section");
const Course = require("../Models/Course");   // Import the Course model
const Section = require("../Models/Section");

// ================= CREATE SECTION =================
exports.createSection = async (req, res) => {
  try {
    // 1. Data fetch
    const { sectionName, courseId } = req.body;

    // 2. Validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All inputs are required",
      });
    }

    // 3. Section create
    const newSection = await Section.create({ sectionName });

    // 4. Update course by pushing Section _id into courseContent
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: newSection._id },
      },
      { new: true }
    )
      .populate({
        path: "courseContent", // matches field name in Course schema
        populate: {
          path: "subSection", // subSection is inside Section schema
        },
      })
      .exec(); 


    // 5. Send response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while creating section",
      error: error.message,
    });
  }
};


// update subsection  
 exports.updateSection =async (req,res)=>{
     try {
        //date fetch 
        const {sectionName ,sectionId} =req.body;

        //validate 
        if (!sectionName ||!sectionId) {
           return res.status(403).json({
            success:false,
            message:"All inputs are required"
           } );
        }
        //find by id and update 
  const Section =await Section.findByIdAndUpdate(sectionId,{
    sectionName
  },{new:true});
        //return 
 return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      updatedCourse,
    });
        
     } catch (error) {
        
        return res.status(500).json({
            success:false,
            message:"Something error while updating"
        })
     }
 }

 // delete subsection  
 exports.deleteSection =async (req,res)=>{
     try {
        //date fetch 
        const {sectionId} =req.params;

        //validate 
        if (!sectionId) {
           return res.status(403).json({
            success:false,
            message:"All inputs are required"
           } );
        }
        //find by id and delete 
           await Section.findByIdAndDelete(sectionId);
        //return 
 return res.status(200).json({
      success: true,
      message: "Section delete successfully",
      updatedCourse,
    });
        
     } catch (error) {
        
        return res.status(500).json({
            success:false,
            message:"Something error while deleting"
        })
     }
 }