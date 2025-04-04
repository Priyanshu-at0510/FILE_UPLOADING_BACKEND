const express=require("express");
//create app
const app=express();

//Find PORT
require("dotenv").config();
const PORT=process.env.PORT || 3000;
//add middlewares
app.use(express.json());
const fileupload=require("express-fileupload"); //use for making interaction between express and files
app.use(fileupload({
    useTempFiles:true,
})); //this method will upload the file into server

//connect with DB
const db=require("./config/database");
db.connect();

//connect with Cloudinary
const cloudinary=require("./config/cloudinary");
cloudinary.cloudinaryConnect();

//mount the API route
const upload=require("./routes/FileUpload");
app.use("/api/v1/upload",upload);

//activate the server
app.listen(PORT,()=>{
    console.log(`server started at PORT : ${PORT}`);
});



