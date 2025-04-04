const File=require("../models/File");


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