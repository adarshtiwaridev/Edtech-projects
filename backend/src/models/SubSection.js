const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({

    title :{
        type: String,
        required: true,
        trim: true
    },
    timeDuration: {
        type: String,
        default: "0",
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    videourl: {
        type: String,
        required: true,
        trim: true
    },
    pdfUrl: {
        type: String,
        default: "",
        trim: true
    },
    pdfName: {
        type: String,
        default: "",
        trim: true
    },

    
});
const SubSection = mongoose.models.SubSection || mongoose.model("SubSection", SubSectionSchema);
module.exports = SubSection;
