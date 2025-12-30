import mongoose from "mongoose";
const resumeSchema=new mongoose.Schema({
    resumeId:{
        type:String,
        required:true,
        unique:true
    },
    usedId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

},{timestamps:true });
const Resume=mongoose.model("Resume",resumeSchema);
export default Resume;