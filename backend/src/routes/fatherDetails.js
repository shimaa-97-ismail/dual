import express from "express";
import {getFatherDetails,createFather,updateFather,deleteFather} from "../controllers/fatherDetails.js";
const router = express.Router();

router.get("/",getFatherDetails);
router.post("/",createFather);
router.put("/:id",updateFather);
router.delete("/:id",deleteFather);

export  {router as fatherDetailsRouter};

