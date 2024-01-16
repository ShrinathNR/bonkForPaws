import express from "express";
const router = express.Router();

import getDonationAddress from "../../controllers/user/getDonationAddress";

router.get('/', getDonationAddress);

export default router;
