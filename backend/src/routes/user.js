import express from "express";
import {getUser,createUser,updateUser ,deleteUser,loginUser,getMe,forgetPassword,resetPassword,verifyResetToken,logoutUser} from "../controllers/user.js";
import { protect,restrictTo } from "../middleware/auth.js";

const router = express.Router();


router.post("/login",loginUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-token", verifyResetToken);

router.use(protect);

router.get("/me", getMe);
router.post('/logout', logoutUser);

router.get("/",restrictTo('admin', 'supervisor', 'manager'),getUser);
router.post("/",restrictTo('admin'),createUser);
router.put("/:id",restrictTo('admin'),updateUser);
router.delete("/:id",restrictTo('admin'),deleteUser);


export  {router as userRouter};