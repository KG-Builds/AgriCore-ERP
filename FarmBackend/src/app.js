import express from "express";
import { loginUser, registerUser } from "./controllers/registerController.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//app.use is used for middlewares and configuration
app.use(
    //cors setting configure
    cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true,
}))

//limit the json request to prevent from server crash
app.use(express.json({limit:"20kb"}));

//allow the url parameter to be taken as input
//parses incoming requests with urlencoded payloads
app.use(express.urlencoded({extended:true, limit:"16kb"}));

//allow some static resources like image with specified folder
app.use(express.static("public"));

//allow us to manipulate the user cookie stored in the browser
app.use(cookieParser());

//routes
//route import
import {userRouter } from "./routes/user.routes.js";

//user routes
//all user related request will be routed from here only
app.use("/api/v1/user", userRouter)

//other routes


export default app;