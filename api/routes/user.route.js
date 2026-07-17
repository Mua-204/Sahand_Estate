import express from "express";
import { test,UpdateUser,DeleteUser,getUserListings } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
//for the UPDATE API :came here after creating my cloudinary image url
router.post('/update/:id', verifyToken,UpdateUser);//THE :id there is to access a particular user

//DELETE API
router.delete("/delete/:id", verifyToken, DeleteUser);

//getUserListing API
router.get('/listings/:id',verifyToken,getUserListings)

export default router;