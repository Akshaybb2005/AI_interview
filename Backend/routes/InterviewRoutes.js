import express from 'express'; 
import multer from 'multer';
import {requireAuth} from '../Middleware/Authmiddleware.js';
import { checkAuth } from '../controllers/Authcontroller.js';
import {analyzeResume,handleResume} from '../controllers/interview/interview.extract.js';
import {startInterview,handleAnswer} from '../controllers/interview/interview.controller.js';
const router=express.Router();
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')},
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname)}});
const upload=multer({storage:storage});
router.post('/uploadresume',upload.single('resume'),requireAuth,handleResume);
router.post('/analyzeResume',requireAuth,analyzeResume);
router.post('/startInterview',requireAuth,startInterview);
router.post('/handleAnswer',requireAuth,handleAnswer);
export default router;