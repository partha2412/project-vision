import express from 'express'
import { login, signup } from '../controllers/authControllers.js';
const router = express.Router();
router.get('/login',login)
router.get('/signup',signup)
export default router;