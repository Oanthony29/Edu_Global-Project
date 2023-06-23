const teacherTimeTable = require("../Models/teacherTimeTableModel");
const teacherModel = require("../Models/addTeacherModel")
const cloudinary = require("../Utils/cloudinary");

exports.addImage = async(req,res)=>{
    try{
        const newTimetable = req.params.teacherId;
        const Teacher = await teacherModel.findById(newTimetable);
        // console.log(Timetable)
        const result = await cloudinary.uploader.upload(
            req.files.timetableImage.tempFilePath,{folder:"timetableImage"},
         (err, timetableImage) => {
           try {
             return timetableImage;
           } catch (err) {
             return err.message;
           }
         }
       );
       const {timetableImage} =req.body
        const Data = {
            timetableImage: {
                public_id:result.public_id,
                url:result.secure_url
            }
        }
        const timetable = await teacherTimeTable(Data);
        timetable.teacherName = Teacher;
        await timetable.save()
        Teacher.timetable = timetable;
        await Teacher.save();
        // console.log(timetable)
       
        res.status(201).json({
            message: "New timetable has been created",
            // data: timetable
        });
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};
exports.getAllTimetable = async(req,res)=>{
    try{
        const allTimetable = await teacherTimeTable.find();
        res.status(200).json({
            message: "All teachers timetable",
            data: allTimetable
        });
    }catch(e){
        res.status(404).json({
            message: e.message
        });
    };
};
exports.updateTimetable = async(req,res)=>{
    try{}catch(e){
        res.status(404).json({
            message: e.message
        });
    }
};