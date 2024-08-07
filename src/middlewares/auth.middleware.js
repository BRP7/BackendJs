import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandle } from "../../utils/asyncHandle.js";
import { User } from "../models/user.models.js";

export const verifyJwt = asyncHandle(async (req, res, next) => {
    try {
        console.log(req.cookies?.accessToken);
        // const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized Token")
        }

        const decodeToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Token")

    }

})