import express from "express";
import {createIntake,getIntakes,updateIntake,deleteIntake} from "../controllers/intake.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/",getIntakes);
router.post("/",createIntake);
router.put("/:id",updateIntake);
router.delete("/:id",deleteIntake);

export  {router as intakeRouter};