import express  from 'express';
import {getSchoolSpecials,createSchoolSpecial,updateSchoolSpecial,deleteSchoolSpecial} from "../controllers/schoolSpecial.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/",getSchoolSpecials );
router.post("/",createSchoolSpecial );
router.put("/:id",updateSchoolSpecial );
router.delete("/:id",deleteSchoolSpecial );

export { router as schoolSpecialRouter };