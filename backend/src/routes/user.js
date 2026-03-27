import express from "express";
import {getUser,createUser,updateUser ,deleteUser,loginUser,getMe,forgetPassword,resetPassword,verifyResetToken} from "../controllers/user.js";
const router = express.Router();


router.get("/",getUser);
router.post("/",createUser);
router.put("/:id",updateUser);
router.delete("/:id",deleteUser);
router.post("/login",loginUser);
router.get("/me", getMe);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-token", verifyResetToken);

export  {router as userRouter};