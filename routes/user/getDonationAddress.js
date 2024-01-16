import express from "express";
const router = express.Router();

import getDonationAddress from "../../controllers/user/getDonationAddress.js";

router.get('/', getDonationAddress);

export default router;
