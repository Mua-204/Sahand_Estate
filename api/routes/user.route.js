import express from "express";
import { test,UpdateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
//for the UPDATE API :came here after creating my cloudinary image url
router.post('/update/:id', verifyToken,UpdateUser);//THE :id there is to access a particular user
export default router;