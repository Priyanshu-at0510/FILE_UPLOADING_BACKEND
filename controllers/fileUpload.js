const File=require("../models/File");
const cloudinary=require("cloudinary").v2;

//localfileupload->handler function

exports.localFileUpload=async (req,res)=>{
    try {
        //fetch the file from request
        const file=req.files.file;
        console.log("File:",file);

        //kha pe hume apni file ko upload karna hai
        //create a path where file need to be stored on server
        let path= __dirname + "/files/" + Date.now() + `.${file.name.split('.'[1])}`;  //server ka path
        console.log("PATH->",path);
        
        //add path to the move function
        file.mv(path,(err)=>{ //using move function ,hum apni file ko above defined path me store karwa denge
             console.log(err);
        });
        res.json({
            success:true,
            message:"Local file Uploaded Successfully"
        });

    } catch (error) {
        console.log("Not Able to upload the file");
        console.log(error);
    }
}

function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder){
    const options={folder};
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}
//image upload ka handler
exports.imageUpload=async (req,res)=>{
    try {
        //fetch the data
        const {name,tags,email}=req.body;
        console.log(name,tags,email);
        //recieve the file
        const file=req.files.imageFile;
        console.log(file);
        //validation
        const supportedTypes=["jpg","jpeg","png"];
        const myFileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type :",myFileType);
        if(!isFileTypeSupported(myFileType,supportedTypes)){
         return res.status(400).json({
            success:false,
            message:"File format not supported",
         })
        }
        
        //file format supported hai
        const response=await uploadFileToCloudinary(file,"Ishu");
        console.log(response);
        //DB me entry save karni hai
        const fileData=await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        })

        res.status(200).json({
            success:true,
            imageUrl:response.secure_url,
            message:"Image Successfully Uploaded to cloudinary"
        }) 

    } catch (error) {
        console.log(error);
        res.status(401).json({
            success:false,
            message:"File is Not Uploaded in Cloudinary ,Something went wrong"
        })
    }
}
