const classModel = require("../Models/classModel");


exports.allClass = async(req, res)=>{
    try{
        const addedClass = await classModel.find().populate("students").populate("teachers")

            res.status(201).json({
                classlength: addedClass.length,
                message: "All CLASSES",
                data: addedClass
            })
    }catch(e){
        res.status(400).json({
            message: e.message
        })
    }
}
exports.oneClass = async(req, res)=>{
    try{
        const id = req.params.classId
        const singleClass = await classModel.findById(id)
        if(!singleClass) {
            res.status(404).json({
                message: `No such Class`
            })
        }else{
            res.status(201).json({
                message: "A SINGLE CLASS.",
                data: singleClass
            })
        }
    }catch(e){
        res.status(400).json({
            message: e.message
        })
    }
}
exports.updateClass = async (req,res)=>{
    try{
        const classId = req.params.classId;
        // const classes = await classModel.findById(classId);
        const data = req.body
        const updatedClass = await classModel.findByIdAndUpdate(classId,data,{new: true})
        if(!updatedClass ){
            res.status(404).json({
                message: `Class doesnt exist`
            });
        }else{
            res.status(200).json({
                message: "Updated Successfully",
                data: updatedClass
            });
        }
    }catch(e){
        res.status(500).json({
            message: e.message
        });
    }
}
exports.deleteClass = async (req,res)=>{
    try{
        const id = req.params.classId;
        const removeClass = await classModel.findByIdAndRemove(id);
        
        if(!removeClass ){
            res.status(404).json({
                message: `NO such User`
            });
        }else{
            res.status(200).json({
                message: "Successfully deleted",
            });
        }
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
}
exports.createClass = async(req,res)=>{
    try{
        const {nameOfClass,classBranch,monthlyTutionFees} = req.body
        const data = {
            nameOfClass,
            classBranch,
            monthlyTutionFees
        }
        const newClass = await classModel.create(data)
        res.status(200).json({
            message: "New Class Created",
            data: newClass
        });
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};