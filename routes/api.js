import express from "express";
const router = express.Router();

// admin
import updateAnimalCharity from "./admin/updateAnimalCharity.js";

//user
import getAnimalCharity from "./user/getAnimalCharity.js";
import getDonationAddress from "./user/getDonationAddress.js"


router.use('/updateAnimalCharityList', updateAnimalCharity);
router.use('/getAnimalCharityList', getAnimalCharity);
router.use('/getDonationAddress', getDonationAddress);

export default router;