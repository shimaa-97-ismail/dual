import express from "express";
import {createIntake,getIntakes,updateIntake,deleteIntake} from "../controllers/intake.js";
const router = express.Router();

router.get("/",getIntakes);
router.post("/",createIntake);
router.put("/:id",updateIntake);
router.delete("/:id",deleteIntake);

export  {router as intakeRouter};