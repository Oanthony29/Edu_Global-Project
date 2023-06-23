const AddStudent = require("../Models/addStudentModel");
const classModel = require("../Models/classModel");
const emailSender = require("../Utils/email");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken")

exports.newStudent = async(req,res)=>{
    try{
        const {studentName,email, password,regNumber,admissionYear, guardianPhoneNumber,DOB} = req.body;
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);
        const classNew = req.params.classId;
        const theClass = await classModel.findById(classNew)

        const data = {
            studentName,
            email,
            password: hash,
            regNumber,
            admissionYear,
            guardianPhoneNumber,
            DOB
        }
        const createNewUser = new AddStudent(data);
        const userToken = jwt.sign({
            id: createNewUser._id,
            password: createNewUser.password,
            isStudent: createNewUser.isStudent
        }, process.env.JWT_TOKEN,{expiresIn: "1d"});

        createNewUser.token = userToken;
        createNewUser.classes = theClass
        await createNewUser.save();
        theClass.students.push(createNewUser);
        await theClass.save()

        // const userVerify = `${req.protocol}://${req.get("host")}/api/verifyStudent/${createNewUser._id}`;
        const message = `You have been registered as new User in the Eduglobal Application by your Admin.Thank you for registering with our app.`
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
exports.studentLogin = async(req,res) => {
    try{
        const {email} = req.body
        const check = await AddStudent.findOne({ email: email}); 
        if(!check) return res.status(404).json({message: "Not Found"});
        const IsPassword = await bcryptjs.compare(req.body.password, check.password)
        if(!IsPassword) return res.status(404).json({message: "Email or Password incorrect"});
        if(!check.isStudent) return res.status(400).json({message: "You are not a student, you cannot login"});

        const myToken = jwt.sign({
            id: check._id,
            password: check.password,
            isStudent: check.isStudent
        }, process.env.JWT_TOKEN,{ expiresIn: "1d"});

        check.token = myToken
        await check.save();

        // console.log(check.isStudent)
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
exports.getAllStudents = async(req,res)=>{
    try{
        const allStudents = await AddStudent.find();
        res.status(201).json({
            message: "All Students",
            length: allStudents.length,
            data: allStudents
        });    
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};
exports.getSingleStudent = async(req,res)=>{
    try{
        const studentid = req.params.studentid
        const singleStudent = await AddStudent.findById(studentid).populate("classes").populate("result");
        res.status(201).json({
            message: "Single Student",
            data: singleStudent
        });    
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};
exports.AllStudentsperClass = async(req,res)=>{
    try{
        const classNew = req.params.classId;
        const theClass = await classModel.findById(classNew).populate("students")
        const allStudent = await AddStudent.findOne({theClass}).populate("classes");
        res.status(201).json({
            message: "All Students",
            length: allStudent.length,
            data: theClass
        });    
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};
exports.deleteStudents = async(req,res)=>{
    try{
        const classNew = req.params.classId;
        const studentid = req.params.studentid
        await AddStudent.findByIdAndDelete(studentid);
        const theClass = await classModel.findById(classNew);
        await theClass.students.pull(studentid)
        await theClass.save();

        res.status(200).json({
             message: "Student Successfully Deleted"
            })
        
    }catch(e){
        res.status(404).json({
            message: e.message
        });
    }
};
exports.updateStudent = async(req,res)=>{
    try{
        const studentId = req.params.studentId;
        const students = await AddStudent.findById(studentId);
        const data = req.body;
        const updateStudent = await AddStudent.findByIdAndUpdate(students,data,{new: true});

        res.status(200).json({
            status: "Successfull",
            data: updateStudent
        });
    }catch(e){
        res.status(404).json({
            message: e.message
        });
    }
};
exports.studentLogOut = async(req,res)=>{
    try{
        const Studentlogout = await AddStudent.findById(req.params.studentId);
        const myToken = jwt.sign({
            id: Studentlogout._id,
            password: Studentlogout.password,
            isStudent: Studentlogout.isStudent
        }, process.env.JWT_DESTROY,{ expiresIn: "5sec"});
        Studentlogout.token = myToken;
        await Studentlogout.save();
        res.status(200).json({
            message: "Successfully Logged Out"
        });

    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};
exports.Forgotpassword = async (req, res) => {
    try{
        const {email} = req.body
        const studentEmail = await AddStudent .findOne({email})
        if(!studentEmail) return  res.status(404).json({ message: "No Email" })

        const myToken = jwt.sign({
            id:studentEmail._id,
            isStudent:studentEmail.isStudent}, process.env.JWT_TOKEN, {expiresIn: "5m"})

        const VerifyLink = `${req.protocol}://${req.get("host")}/api/forgotPassword/${studentEmail._id}/${myToken}`
        const pageUrl = `${req.protocol}://edu-global-application.onrender.com/#/resetpassword/${studentEmail._id}/${myToken}`
        const message = `Use this link ${pageUrl} to reset your password. 
        This link expires in 5 minutes`;
        emailSender({
          email: studentEmail.email,
          subject: "Reset Pasword",
          message,
        })
        
        res.status(202).json({
            message:"email have been sent"
        })

        // console.log(studentEmail);
    }catch(err){
        res.status(400).json({
            message:err.message
        })
    }
};
exports.resetpassword = async (req, res) => {
    try {
        const {password} = req.body
        const studentId = req.params.studentId
        const passwordReset = await AddStudent.findById(studentId)
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);
        // console.log(passwordReset)

        await AddStudent.findByIdAndUpdate(passwordReset._id,{
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
        const studentId = req.params.studentId;
        const NewPassword = await AddStudent.findById(studentId)
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);
        await AddStudent.findByIdAndUpdate(NewPassword, {
            password: hash
        },{new: true})

        res.status(202).json({
            message:"Password has been changed"
        });
    }catch(e){
        res.status(400).json({
            message:e.message
        }) 
    }
};