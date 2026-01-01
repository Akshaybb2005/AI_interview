import express from 'express';
import { register, login, logout,checkAuth } from "../controllers/Authcontroller.js";
const router=express.Router();
router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);
router.get('/me',checkAuth);
export default router;