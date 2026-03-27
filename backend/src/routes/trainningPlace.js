import express from "express";
import { createTrainningPlace, getAllTrainningPlaces,getTrainningPlaceById,updateTrainningPlace,deleteTrainningPlace } from "../controllers/trainningPlace.js";

const router = express.Router();
router.post("/", createTrainningPlace);
router.get("/", getAllTrainningPlaces);
router.get("/:id", getTrainningPlaceById);
router.put("/:id", updateTrainningPlace);
router.delete("/:id", deleteTrainningPlace);



export  { router as trainningPlaceRouter };