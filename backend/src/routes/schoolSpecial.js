import express  from 'express';
import {getSchoolSpecials,createSchoolSpecial,updateSchoolSpecial,deleteSchoolSpecial} from "../controllers/schoolSpecial.js";
const router = express.Router();

router.get("/",getSchoolSpecials );
router.post("/",createSchoolSpecial );
router.put("/:id",updateSchoolSpecial );
router.delete("/:id",deleteSchoolSpecial );

export { router as schoolSpecialRouter };