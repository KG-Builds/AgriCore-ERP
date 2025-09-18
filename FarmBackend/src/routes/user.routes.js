import { Router } from "express";
import { registerUser, loginUser, logOutUser, updateUserPassword } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

//creating an router object 
const router = Router();

//checks the part after /user/ of the API endpoint
//if the last part is register then automatically calls the register user function
router.route("/register").post(registerUser);

//routes to the login request to the login function
router.route("/login").post(loginUser);

//protected routes
//logout route for user
router.route("/logOut").post(verifyJWT, logOutUser);

//change user password route
router.route("/update-user-password").post(verifyJWT, updateUserPassword);

router.route("/checkMic").get(verifyJWT, (req, res)=>(
    res.json("Hello ")
))

export {router};

