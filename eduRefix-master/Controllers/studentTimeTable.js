const studentTimeTable = require("../Models/studentTimeTableModel");
const studentModel = require("../Models/addStudentModel");
const cloudinary = require("../Utils/cloudinary");

exports.addImage = async(req,res)=>{
    try{
        const newTimetable = req.params.studentId;
        const Student = await studentModel.findById(newTimetable);
        const result = await cloudinary.uploader.upload(
            req.files.timetableImage.tempFilePath,{folder:"timetableImage"},
         (err, timetableImage) => {
           try {
             return timetableImage;
           } catch (err) {
             return err;
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
        const timetable = await studentTimeTable(Data);
        timetable.studentName = Student;
        await timetable.save()
        Student.timetable = timetable;
        await Student.save();

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
exports.getAllStudentTimetable = async(req,res)=>{
    try{
        const allTimetable = await studentTimeTable.find();
        res.status(200).json({
            message: "All student timetable",
            data: allTimetable
        });
    }catch(e){
        res.status(404).json({
            message: e.message
        });
    };
};