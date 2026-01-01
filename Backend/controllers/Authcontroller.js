import User from '../models/userschema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register=async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        const existingUser=await User.findOne({email});
        if(existingUser){
            return  res.status(400).json({message:"User already exists"});
        }   
        const salt=await bcrypt.genSalt(12);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            name,
            email,
            password:hashedPassword,
        });
        await newUser.save();
        res.status(201).json({message:"User registered successfully"});
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
};
const login=async(req,res)=>{
    const {email,password}=req.body;    
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
          res.cookie('token', token, {
             httpOnly: true, 
            secure:  process.env.NODE_ENV !== "development",
            samesite: "strict",
            maxAge: 60 * 60 * 1000,
    });
        res.status(200).json({message:"Login successful"});
      }catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
};
const logout=async(req,res)=>{
    // For JWT, logout can be handled on client side by deleting the token
    res.clearCookie('token');
    res.status(200).json({message:"User logged out successfully"});
};
const checkAuth=async(req,res)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({message:"Unauthorized"});
        }
        res.status(200).json({user});
    
    }catch(error){
        res.status(401).json({message:"Unauthorized"});
    }   
};

export {register,login,logout,checkAuth};