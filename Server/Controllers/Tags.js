const Categories=require("../Models/Categories")


//create Tag Handler function 
exports.Categories=async (req,res) =>{
    try {
        
        const {name,descriptions} =req.body;

        //validations
        if (!name ||!description) {
            return res.status(403).json({
                success:false,
                message:"All input are required"
            });

            
        }
 
 // cretion detail in mongodb
 const categoriesdetails=await Categories.create({
    name:name,
    description:description,
     courses: []   // initially empty
 })
 // consloe 
 console.log(categoriesdetails);
 return res.status(200).json({
    success:true,
    message:"Successfull tags are created "
 })


    }  
    catch (error) {
       
        return res.status(500).json({
            success:false,
            message:"Something error while creatting the error"
        })
    }
}


// get al tags

//create show Tag Handler function 
exports.ShowCategories=async (req ,res) =>{
    try {
        
        const alltags=await Categories.find({},{name:true,description:true});

           return res.status(200).json({
            success:false,
            message:"All tags are   returened successfully",
            alltags
           })  
        
 


    }
    catch
     (error) {
       
        return res.status(500).json({
            success:false,
            message:"Something error while creatting the error"
        });
    }
}