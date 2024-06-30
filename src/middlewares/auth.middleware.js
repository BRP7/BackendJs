import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/ApiError";
import { asyncHandle } from "../../utils/asyncHandle";
import { User } from "../models/user.models";

export const verifyJwt = asyncHandle(async(req,rres,next)=>{
   try {
    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
     if(!token){
         throw new ApiError(401,"Unauthorized Token")
     }
 
     const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRAT)
    const user =  await User.findById(decodeToken?._id).select("-password -refreshToken")
 
    if(!user){
     throw new ApiError(401,"Invalid Access Token")
    }
 
    req.user = user;
    next();
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid Token")
    
   }

})