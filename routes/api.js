import express from "express";
const router = express.Router();

// admin
import updateAnimalCharity from "./admin/updateAnimalCharity.js";

//user
import getAnimalCharity from "./user/getAnimalCharity.js";


router.use('/updateAnimalCharityList', updateAnimalCharity);
router.use('/getAnimalCharityList', getAnimalCharity);

export default router;