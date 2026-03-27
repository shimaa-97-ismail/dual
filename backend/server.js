dotenv.config();
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {connectDB} from "./src/config/db.js";
const app = express();
const PORT = process.env.PORT || 5000;


import { schoolRouter } from "./src/routes/school.js";
import { userRouter } from "./src/routes/user.js";
import { schoolSpecialRouter } from "./src/routes/schoolSpecial.js";
import { studentRouter } from "./src/routes/student.js";
import { trainningPlaceRouter } from "./src/routes/trainningPlace.js";
import {departementRouter} from "./src/routes/depatement.js";
import {fatherDetailsRouter} from "./src/routes/fatherDetails.js";
import {typeOfSchoolRouter} from "./src/routes/typeOfSchool.js";
import {intakeRouter} from "./src/routes/intake.js";
import { intakeModel } from "./src/models/intake.js";


app.use(cors());
app.use(express.json());

app.use("/school", schoolRouter);
app.use("/user", userRouter);
app.use("/schoolSpecial", schoolSpecialRouter);
app.use("/student", studentRouter);
app.use("/trainning-place", trainningPlaceRouter);
app.use("/departement",departementRouter);
app.use("/fatherDetaild",fatherDetailsRouter)
app.use("/typeOfSchool",typeOfSchoolRouter);
app.use("/intake",intakeRouter);



 await connectDB();
 await intakeModel.syncIndexes();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});