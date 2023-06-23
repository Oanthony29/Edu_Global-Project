const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: 'dwt2lavnm', 
    api_key: '989516128674283', 
    api_secret: 'aLYAw_Cs2Jy2CsfheRGHtiU4CFM' 
});

module.exports=cloudinary;