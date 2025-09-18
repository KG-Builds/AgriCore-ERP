import { Router } from "express";
import { registerUser, loginUser } from "../controllers/registerController";

//creating an router object 
const router = Router();

//checks the part after /user/ of the API endpoint
//if the last part is register then automatically calls the register user function
router.route("/register").post(registerUser);

//routes to the login request to the login function
router.route("/login").post(loginUser);

export {router};

