const AddTeacher = require("../Models/addTeacherModel");
const classModel = require("../Models/classModel");
const teacherAttModel = require("../Models/teacherAttendanceModel")
const studentAttModel = require("../Models/studentAttendanceModel")
const emailSender = require("../Utils/email");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken")

exports.newTeacher = async(req,res)=>{
    try{
        const {teacherName,gender,email, password,homeAddress,phoneNumber, joiningDate,educationLevel,DOB,experience,salary,subjectToTeach} = req.body;
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);
        const classNew = req.params.classId;
        const theClass = await classModel.findById(classNew)

        const data = {
            teacherName,
            gender,
            email,
            password: hash,
            homeAddress,
            phoneNumber,
            joiningDate,
            educationLevel,
            DOB,
            experience,
            salary,
            subjectToTeach
        }
        const createNewUser = new AddTeacher(data);
        const userToken = jwt.sign({
            id: createNewUser._id,
            password: createNewUser.password,
            isTeacher: createNewUser.isTeacher
        }, process.env.JWT_TOKEN,{expiresIn: "1d"});

        createNewUser.token = userToken;
        createNewUser.teacherclass = theClass
        await createNewUser.save();
        theClass.teachers.push(createNewUser);
        await theClass.save()

        // const userVerify = `${req.protocol}://${req.get("host")}/api/verifyStudent/${createNewUser._id}`;
        const message = `You have been registered as New User in the Eduglobal Application by your Admin.Thank you for registering with our app.`
        emailSender({
            email: createNewUser.email,
            subject: "Welcome, New User",
            message,
        });

        function validateEmail(email) {
            const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return re.test(email);
        }
        
        const isValidEmail = validateEmail(email);
        if (isValidEmail) {
         return res.status(201).json({
            message: "User Created",
            data: createNewUser
         })
        } else {
            return res.status(400).json({
                message: 'Email address is invalid',
                message2: "Could not create User"
            })
        }
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};
exports.teacherLogin = async(req,res) => {
    try{
        const {email} = req.body
        const check = await AddTeacher.findOne({ email: email}); 
        if(!check) return res.status(404).json({message: "Not Found"});
        const IsPassword = await bcryptjs.compare(req.body.password, check.password)
        if(!IsPassword) return res.status(404).json({message: "Email or Password incorrect"});
        if(!check.isTeacher) return res.status(400).json({message: "You are not a teacher, you cannot login"});

        const myToken = jwt.sign({
            id: check._id,
            password: check.password,
            isTeacher: check.isTeacher
        }, process.env.JWT_TOKEN,{ expiresIn: "1d"});

        check.token = myToken
        await check.save();

        // console.log(check.isTeacher)
     const{password,...others} = check._doc
        
        res.status(201).json({
            message: "Successful",
            data: others
        });
     }catch(e){
        res.status(404).json({
            message: e.message
        });
    }
};
exports.getAllTeachers = async(req,res)=>{
    try{
        const allTeacher = await AddTeacher.find();
        res.status(201).json({
            message: "All Teacher",
            length: allTeacher.length,
            data: allTeacher
        });    
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};
exports.getOne = async(req,res)=>{
    try{
        const teacherid = req.params.teacherid;
        const singleTeacher = await AddTeacher.findById(teacherid).populate("teacherclass");
        res.status(201).json({
            message: "Single Teacher",
            data: singleTeacher
        });    
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};
exports.AllTeachersperClass = async(req,res)=>{
    try{
        const allTeacher = await AddTeacher.find().populate("teacherclass");
        res.status(201).json({
            message: "All Teacher in ",
            length: allTeacher.length,
            data: allTeacher
        });    
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};
exports.deleteTeacher = async(req,res)=>{
    try{
        const classNew = req.params.classId;
        const teacherid = req.params.teacherid
        await AddTeacher.findByIdAndDelete(teacherid);
        const theClass = await classModel.findById(classNew);
        await theClass.teachers.pull(teacherid)

        res.status(200).json({ message: "Teacher Successfully Deleted"})
    }catch(e){
        res.status(404).json({
            message: e.message
        });
    }
};
exports.Forgotpassword = async (req, res) => {
    try{
        const {email} = req.body
        const teacherEmail = await AddTeacher .findOne({email})
        if(!teacherEmail) return  res.status(404).json({ message: "No Email" })

        const myToken = jwt.sign({
            id:teacherEmail._id,
            isTeacher:teacherEmail.isTeacher}, process.env.JWT_TOKEN, {expiresIn: "5m"})

        const VerifyLink = `${req.protocol}://${req.get("host")}/api/forgotPassword/${teacherEmail._id}/${myToken}`
        const pageUrl = `${req.protocol}://edu-global-application.onrender.com/#/resetpassword/${teacherEmail._id}/${myToken}`
        const message = `Use this link ${pageUrl} to reset your password. 
        This link expires in 5 minutes`;
        emailSender({
          email: teacherEmail.email,
          subject: "Reset Pasword",
          message,
        })
        
        res.status(202).json({
            message:"email have been sent"
        })

        // console.log(teacherEmail);
    }catch(err){
        res.status(400).json({
            message:err.message
        })
    }
};
exports.resetpassword = async (req, res) => {
    try {
        const {password} = req.body
        const teacherId = req.params.teacherId
        const passwordReset = await AddTeacher.findById(teacherId)
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);

        await AddTeacher.findByIdAndUpdate(passwordReset._id,{
            password: hash
        },{new: true})

        res.status(202).json({
            message:"Password has been reset"
        })

    } catch (err) {
        res.status(400).json({
            message:err.message
        })
    }
};
exports.changePassword = async(req,res)=>{
    try{
        const {password} = req.body;
        const teacherId = req.params.teacherId;
        const teacherPassword = await AddTeacher.findById(teacherId)
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);
        await AddTeacher.findByIdAndUpdate(teacherPassword, {
            password: hash
        },{new: true})

        res.status(202).json({
            message:"Password has been changed"
        })

    }catch(e){
        res.status(400).json({
            message:e.message
        }) 
    }
};
exports.teacherLogOut = async(req,res)=>{
    try{
        const teacherId = req.params.teacherId
        const Teacherlogout = await AddTeacher.findById(teacherId);
        const myToken = jwt.sign({
            id: Teacherlogout._id,
            password: Teacherlogout.password,
            isTeacher: Teacherlogout.isTeacher
        }, process.env.JWT_DESTROY,{ expiresIn: "5sec"});
        Teacherlogout.token = myToken;
        await Teacherlogout.save();
        res.status(200).json({
            message: "Successfully Logged Out"
        });

    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};
exports.updateTeacher = async(req,res)=>{
    try{
        const teacherId = req.params.teacherId;
        const teachers = await AddTeacher.findById(teacherId);
        const data = req.body;
        const updateTeacher = await AddTeacher.findByIdAndUpdate(teachers,data,{new: true});

        res.status(200).json({
            status: "Successfull",
            data: updateTeacher
        });
    }catch(e){
        res.status(404).json({
            message: e.message
        });
    }
};