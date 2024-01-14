import express from "express";
const router = express.Router();

import getAnimalCharityList from '../../controllers/user/getAnimalCharityList.js';

router.get('/', getAnimalCharityList);

export default router;
