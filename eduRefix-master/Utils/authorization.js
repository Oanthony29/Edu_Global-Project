const jwt = require("jsonwebtoken");
const adminModel = require("../Models/adminModel");
const teacherModel = require("../Models/addTeacherModel");
const dotenv = require("dotenv");
dotenv.config({path: "./config/config.env"});

const isSignIn = async (req,res,next)=>{
    const userid = req.params.userid
    const user = await adminModel.findById(userid)
    // console.log (user._id)
    // console.log (user.token)
    if(!user) return res.status(404).json({message: "you are not admin"});

    const Token = user.token
    // console.log(Token)
    if(!Token) return res.status(403).json({message: "you are not authenticated"});
    
    jwt.verify(Token, process.env.JWT_TOKEN, (err, payload)=>{
        if(err) return res.status(403).json({message: "token is not valid!", message2: err.message});

        req.user = payload
        next()
    })

    // const adminAuth = req.params.id
    // // const Admin = await adminModel.findById(adminAuth)
    // // console.log(Admin)
    // console.log(adminAuth)
};

const roleAuth = async(req,res,next)=>{
    isSignIn (req,res, ()=>{
        if(req.user.isAdmin ){
            next()
        }else{
                res.status(403).json({
                    message: "you are not an admin"
                });
        }
    });
};

const IsTeachers = async (req,res,next)=>{
    const teacherid = req.params.teacherid
    const user = await teacherModel.findById(teacherid)

    if(!user) return res.status(404).json({message: "you are not a teacher"});

    const Token = user.token

    if(!Token) return res.status(403).json({message: "you are not authenticated"});
    
    jwt.verify(Token, process.env.JWT_TOKEN, (err, payload)=>{
        if(err) return res.status(403).json({message: "token is not valid!"});

        req.User = payload
        next()
    })
};

const teacherAuth = async(req,res,next)=>{
    IsTeachers (req,res, ()=>{
        if(req.User.isTeacher){
            next()
        }else{
                res.status(403).json({
                    message: "you are not a teacher"
                });
        }
    });
};
module.exports = {
    roleAuth,
    teacherAuth

}