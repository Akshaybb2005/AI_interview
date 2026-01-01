import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({message:"No token in middleware"});

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  }
  catch(error){
console.log("Token verification failed in middleware:", error);
    return  res.status(401).json({message:"Invalid token in middleware"});
  }
}
