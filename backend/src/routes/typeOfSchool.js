import express from "express";
import {getAllTypesOfSchool, getTypeOfSchoolById, createTypeOfSchool, updateTypeOfSchool, deleteTypeOfSchool,getSchoolByType } from "../controllers/typeOfSchool.js";
const router = express.Router();    

router.get("/", getAllTypesOfSchool);
router.get("/:id", getTypeOfSchoolById);
router.post("/", createTypeOfSchool);
router.put("/:id", updateTypeOfSchool);
router.delete("/:id", deleteTypeOfSchool);
router.get("/schools/:id",getSchoolByType);

export { router as typeOfSchoolRouter };