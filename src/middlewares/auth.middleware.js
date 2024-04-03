import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyJwtToken = asyncHandler(async(req,res,next)=>{
    
    try {
        const token = req?.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")
    
        if(!token){
            return next(
                new ApiError(
                    "UnAuthorized request",
                    401
                )
            )
        }
    
        const decodedToken =  jwt.verify(token , process.env.ACCEESS_TOKEN_SECRET)

        if(!decodedToken){
            return next(
                new ApiError(
                    "Invalid Access Token or token expired , please logged In to access New Token",
                    401
                )
            )
        }

        req.user = await User.findByPk(decodedToken.id,{
            attributes:{
                exclude: ["password" , "refreshToken"]
            }
        })

        next()

    } catch (error) {
        return next(
            new ApiError(
                error?.message || "Invalid access Token" , 401 
            )
        )
    }
})