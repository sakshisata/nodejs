import {Router} from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
   createTask,
   getAllTask
} from '../controllers/taskController.js';

const router = Router()

router.route("/create").post(verifyJWT,createTask);
router.route("/alltasks").get(verifyJWT,getAllTask);

export default router