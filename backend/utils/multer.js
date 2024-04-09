const multer = require('multer')

const path = require('path')

const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,path.join(__dirname,'../images/'))
    },

    filename: (req,file,cb) =>{
        console.log(file);
        cb(null,Date.now() + file.originalname)

    }
});

const fileFilter = (req, file, cb) =>{
    const allowedFileTypes = ['image/jpeg','image/jpg','image/png']
    console.log("-----");
    if(allowedFileTypes.includes(file.mimetype)){
       console.log("-<<<<");
        cb(null,true)
    }else{
        cb(new Error('Only images are allowed!'),false) 
    }
}

module.exports.upload = multer({storage,fileFilter})

