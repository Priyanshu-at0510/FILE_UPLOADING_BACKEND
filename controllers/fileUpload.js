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

async function uploadFileToCloudinary(file,folder,quality){
    const options={folder};
    options.resource_type="auto";
    if(quality){
        options.quality=quality;
    }
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


//video upload handler
exports.videoUpload =async (req,res)=>{
    try {
        //fetch the data
        const {name,tags,email}=req.body;
        console.log(name,tags,email);
        //recieve the file
        const file=req.files.videoFile;
        console.log(file);
        // TYPE validation
        const supportedTypes=["mp4","mov"];
        const myFileType=file.name.split('.')[1].toLowerCase();
        console.log("File Type :",myFileType);
        if(!isFileTypeSupported(myFileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File Format is not supported"
            });
        }
        //SIZE validation
        const MAX_SIZE=100*1024*1024;
        console.log("File Size :", file.size)
        if(file.size > MAX_SIZE){
            return res.status(402).json({
                success:false,
                message:"File size is more than 5MB ,please Reduce its size and then upload",
            })
        }

        //upload To Cloudinary
        console.log("uploading to ISHU folder in cloudinary")
        const response=await uploadFileToCloudinary(file,"ISHU");
        console.log(response);

        //upload to db
        const fileData=await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,

        });

        res.status(200).json({
            success:true,
            imageUrl:response.secure_url,
            message:"video Successfully Uploaded to cloudinary and Database"
        });
         


    } catch (error) {
        console.log(error);
        res.status(401).json({
            success:false,
            message:"File is Not Uploaded in Cloudinary ,Something went wrong"
        })
    }
}

//imageSize reducer handler
exports.imageReducerUpload=async (req,res)=>{
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
        const response=await uploadFileToCloudinary(file,"Ishu",30);
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
            message:"Image Successfully Uploaded to cloudinary after reducing size"
        }) 
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success:false,
            message:"File is Not Uploaded in Cloudinary ,Something went wrong"
        })
    }
}