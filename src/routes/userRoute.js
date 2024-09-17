import {Router} from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    loginUser,
    registerUser, 
    userProfile, 
} from '../controllers/userController.js';

const router = Router()

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile").get(verifyJWT,userProfile);

export default router