import express from "express";
const router = express.Router();

import getDonationAddress from "../../controllers/user/getDonationAddress.js";

router.post('/', getDonationAddress);

export default router;
