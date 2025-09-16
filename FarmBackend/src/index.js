import dotenv from "dotenv";
import express from "express";
import app from "./app.js";
import dbConnect from "./db/dbConnect.js";

dotenv.config({
    path: './.env',  //dont write ./env it should be ./.env
})


const port = process.env.PORT;


dbConnect()
.then(
    console.log("DB is connected, now app will run "),
    app.listen(port || 8000, ()=>{
        console.log("Server is running on port no " , port)
        
    })
)
.catch("error", (error)=>{
    console.log("An error occured ", error);
    
})



