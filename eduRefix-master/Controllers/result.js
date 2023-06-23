const ResultModel = require("../Models/resultModel");
const StudentModel = require("../Models/addStudentModel");
const cloudinary = require("../Utils/cloudinary");

exports.uploadResult = async(req,res)=>{
    try{
        const studentid = req.params.studentid;
        const student = await StudentModel.findById(studentid);

        const result = await cloudinary.uploader.upload(
            req.files.resultImage.tempFilePath,{folder:"resultImage"},
         (err, resultImage) => {
           try {
             return resultImage;
           } catch (err) {
             return err;
           }
         }
       );
       const {currentSchoolTerm,resultImage} = req.body;
        const data = {
            currentSchoolTerm,
            resultImage: {
                public_id:result.public_id,
                url:result.secure_url
            }
        }
        const ResultUpload = await ResultModel(data);
        ResultUpload.studentName = student;
        await ResultUpload.save();
        student.result = ResultUpload;
        await student.save();

        res.status(201).json({
            message: "Result Successfully Uploaded",
            // data: ResultUpload
        });
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};
exports.getAllResult = async(req,res)=>{
    try{
        const allResult = await ResultModel.find().populate("studentName");
        res.status(200).json({
            message: "All Student Result",
            data: allResult
        });
    }catch(e){
        res.status(400).json({
            status: "Failed",
            message: e.message
        });
    }
};
exports.getSingleResult = async(req,res)=>{
    try{
        const resultid = req.params.resultid;
        const singleResult = await ResultModel.findById(resultid).populate("studentName");
        res.status(200).json({
            message: "Single student Result",
            data: singleResult
        });
    }catch(e){
        res.status(400).json({
            status: "Failed",
            message: e.message
        });
    }
};
exports.updateResult = async(req,res)=>{
    try{
        const result = await cloudinary.uploader.upload(
            req.files.resultImage.tempFilePath,{folder:"resultImage"},
         (err, resultImage) => {
           try {
             return resultImage;
           } catch (err) {
             return err;
           }
         }
       );
       const {currentSchoolTerm,resultImage} = req.body;
        const data = {
            currentSchoolTerm,
            resultImage: {
                public_id:result.public_id,
                url:result.secure_url
            }
        }
        const resultid = req.params.resultid;
        const updatedResult = await ResultModel.findByIdAndUpdate(resultid, data,{new: true});

        res.status(200).json({
            message: "Update was Sucessful",
            data: updatedResult
        });
    }catch(e){
        res.status(400).json({
            status: "Failed",
            message: e.message
        });  
    }
};
exports.deleteResult = async(req,res)=>{
    try{
        const resultid = req.params.resultid;
        const studentid = req.params.studentid;
        await ResultModel.findByIdAndDelete(resultid);
        const theStudent = await StudentModel.findById(studentid);
        // await theStudent.result.pull(resultid)
        await theStudent.save();

        res.status(200).json({
            message: "Result deleted"
        });
    }catch(e){
        res.status(400).json({
            status: "Failed",
            message: e.message
        }); 
    }
}