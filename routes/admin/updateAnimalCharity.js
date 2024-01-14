import express from "express";
const router = express.Router();

import updateAnimalCharityList from '../../controllers/admin/updateAnimalCharityList.js';

router.get('/', updateAnimalCharityList);

export default router;
