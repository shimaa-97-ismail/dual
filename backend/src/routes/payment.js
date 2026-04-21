import express from "express";
import {getPaymentsSumByPeriod,getPaymentsByIntake} from "../controllers/payment.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/sum-by-period", getPaymentsSumByPeriod);
router.get("/by-intake", getPaymentsByIntake);

export  {router as paymentRouter};