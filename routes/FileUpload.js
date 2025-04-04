const express=require("express");
const router=express.Router();

//import the rote handler
const {imageUpload,videoUpload,imageReducerUpload,localFileUpload}=require("../controllers/fileUpload");


//create the path
// router.post("/imageUpload",imageUpload);
// router.post("/videoUpload",videoUpload);
// router.post("/imageReducerUpload",imageReducerUpload);
router.post("/localFileUpload",localFileUpload);

module.exports=router;
