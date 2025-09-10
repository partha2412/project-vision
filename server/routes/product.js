import express from 'express'
import { addProducts } from '../controllers/productsControllers.js';
const router = express.Router();

router.get('/add',addProducts)


export default router;