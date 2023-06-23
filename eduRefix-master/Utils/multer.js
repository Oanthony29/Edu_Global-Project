const multer = require("multer");
const { extname } = require("path");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "./uploads")
    },
    filename: (req, file, cb)=>{
        cb(null, `${Date.now()}--${file.originalname}` )
    }
});

const fileFilter = (file, cb)=>{
    const fileTypes = /jpeg|jpg|png|svg/;
    const ext = path.extname(file.originalname).toLowerCase()
    const checkExtName = fileTypes.test(extname)

    const mimeType = fileTypes.test(file.mimeType);
    if(mimeType && checkExtName){
        return cb (null, true);
    }else{
        cb(new Error("Unsupported file format"))
    }
}

const multerImage = multer({
    storage: storage,
    // fileFilter: (req, file, cb)=>{
    //     checkFileType(file,cb)
    // },
    fileFilter: fileFilter,
    limits :{
       fileSize:  1024 * 1024 * 20
    }
}).single("schoolImage");

module.exports = multerImage