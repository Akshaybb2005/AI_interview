
import { chunktext, txtfromPdf, store, processQuery } from './pdf.js';
import fs from 'fs';
import {GoogleGenAI} from '@google/genai'
const ai=new GoogleGenAI({
    apiKey:process.env.GOOGLE_API_KEY});



// export const query_embedding=async(req,res)=>{
//     try {
//         const query=req.body.query;
//         const response=await processQuery(query);
//         res.status(200).json({success:true,data:response}); 
//     }
//     catch(error){
//         console.log("Error in query_embedding:",error);
//         res.status(500).json({success:false,message:"Internal Server Error"});
//     }
// }