import dotenv from 'dotenv';
dotenv.config();
import {ChromaClient} from 'chromadb';

import { createRequire } from "module";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// import { GoogleGenerativeAI } from "@google/generative-ai";     
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenAI } from '@google/genai';

/**
 * Extract full text from a PDF file
 * @param {string} filePath - path from req.file.path
 */
const ai=new GoogleGenAI({
    apiKey:process.env.GOOGLE_API_KEY});
const client = new ChromaClient({
  path: "http://localhost:8000"
});
const deletePdfCollection = async () => {
  try {
    await client.deleteCollection({ name: "pdf" });
    console.log("PDF collection deleted");
  } catch {
    console.log("No existing pdf collection");
  }
};
const init=async()=>{
return await client.getOrCreateCollection({
    name:'pdf',
    embeddingFunction:null
});
}
const init_Chathistory=async()=>{
    return await client.getOrCreateCollection({
        name:'chathistory',
        embeddingFunction:null
    });
    }
const chunktext=async(text)=>{
const textsplitter=new RecursiveCharacterTextSplitter({
    chunkSize:1000,
    chunkOverlap:200
});
const docs=await textsplitter.createDocuments([text]);
return docs.map((d)=>d.pageContent);
}
const getEmbedding = async (text) => {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents:text
  });
  const vector=result.embeddings[0].values;
    console.log("Embedding generated successfully.");
    console.log("Embedding generated");
console.log("Vector length:",vector.length);
console.log("First 5 values:", vector.slice(0, 5));

    return vector;
}
export const txtfromPdf = async (fileBuffer) => {
//   const data = new Uint8Array(fs.readFileSync(filePath));
const data = new Uint8Array(fileBuffer);
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .map(item => item.str)
      .join(" ");

    fullText += pageText + "\n";
  }

  return fullText;
};
const store=async(chunks,fieldId='pdf')=>{
    const collections=await init();
    for(let i=0; i<chunks.length; i++){
        const embedding=await getEmbedding(chunks[i]);
        await collections.add({
            ids:[`${fieldId}-${i}`],
            embeddings:[embedding],
            documents:[chunks[i]],
            metadatas:[{fieldId,index:i,type:'pdf'}]
        })
}
console.log("chunk stored:", await collections.count());
return collections;
}

const store_chathistory=async(sessionId,question,answer)=>{
    const collection=await init_Chathistory();
    const chatpair=`Q: ${question}\nA: ${answer}`;
    const embedding=await getEmbedding(chatpair);
    const timestamp=Date.now();
    await collection.add({
        ids:[`${sessionId}-${timestamp}`],
        embeddings:[embedding],
        documents:[chatpair],
        metadatas:[{sessionId,
            question,
            answer,
            timestamp,
            type:'chat'
        }]
    })
}
const processQuery=async(userquery)=>{
    const collection=await init();
    const queryEmbedding=await getEmbedding(userquery);
    const result=await collection.query({
        nResults:5,
        queryEmbeddings:[queryEmbedding]
    })
    const retrivedtexts=result.documents?.[0];
    if (!retrivedtexts || retrivedtexts.length === 0) {
    return "No matching context found.";
}
    const context=retrivedtexts.join('\n');
    const prompt=`Answer the question based on the context below:\n\nContext:${context}\n\nQuestion:${userquery}\n\nAnswer:`;
    const response=await ai.models.generateContent({model:"gemini-2.5-flash",
        contents:prompt
    });
    console.log("AI response generated",response.text );
    return response.text;
}
export {init,init_Chathistory,chunktext,getEmbedding,store,store_chathistory,processQuery,deletePdfCollection};