import express from "express";
import {getDepatement,createDepartement,updateDepartement,deleteDepartement,getDepartementById} from "../controllers/departement.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/",getDepatement);
router.get("/:id",getDepartementById);
router.post("/",createDepartement);
router.put("/:id",updateDepartement);
router.delete("/:id",deleteDepartement);


export  {router as departementRouter};