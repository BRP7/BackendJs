import { asyncHandle } from "../../utils/asyncHandle.js"
import { ApiError } from "../../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../../utils/cloudinary.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something Went Wrong While generating refresh and access token")
    }
}


const registerUser = asyncHandle(async (req, res) => {
    //get user details from front end
    //validation - not empty
    //check if already exists: username,email
    //check for images , check for avatar
    //upload them to cloudinary
    //create user object - create entry in db
    //remove password and referesh token field from response
    //check for user creation
    //return res 

    const { fullname, email, username, password } = req.body;
    // if(fullname == ''){
    //     throw new ApiError(400,"Full Name Is Required")
    // }

    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(400, "User with Email or Username Exist!")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError("Avatar is Required!");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError("Avatar is Required!");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password  -refreshToken")

    // console.log(createdUser);

    if (!createdUser) {
        console.error("Error registering user:", error);
        throw new ApiError(500, "Something Went Wrong While Registering User!")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

    // res.status(200).json({
    //     message: "ok"
    // });
});

const loginUser = asyncHandle(async (req, res) => {
    //req body -> data
    //username or email
    //find the user
    //password check
    //access abd referece token
    //send cookie

    // console.log(req.body);
    const { email, username, password } = req.body
    console.log( (!username || !email));

    if (!username && !email) {
        throw new ApiError(400, "username or email is required!");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "user doesn't exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Password Invalid")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged In Successfully!"
            )
        )
})

const logoutUser = asyncHandle(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, {
        new: true
    }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out!"))
})

const refreshAccessToken = asyncHandle(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }

        if(incomingRefreshToken !== user?.refreshAccessToken){
            throw new ApiError(401, "refresh token is expired or used")
        }

        
    const options = {
        httpOnly: true,
        secure: true
    }

    const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                accessToken, refreshToken:newRefreshToken
                },
                "Access Token Refreshed!"
            )
        )

    } catch (error) {
        throw new ApiError(401, "Unauthorized Request")
    }
})

const changeCurrentPassword = asyncHandle(async(req,res)=>{
    const {oldPassword , newPassword}= req.body
    const user = await User.findById(req.user?.id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid Old Password")
    }

    user.password=newPassword
    await user.save({validateBeforeSave:false})
    return res.status(200)
              .json(new ApiResponse(200,{},"Password Changed Successfully"))
})

const updateAccountDetails = asyncHandle(async(req,res)=>{
    const {fullname,email}=req.body
    if(!(fullname || email)){
        throw new ApiError(400,"All field are required")
    }
    const user=User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullname,
                email
            }
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,{},"Account Details Updated Successfully"))
})

const UpdatedUserAvatar = asyncHandle(async(req,res)=>{
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar File is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar.url){
        throw new ApiError("400","Error While Uploading On cloudinary avatar")
    }

    const user=User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
              avatar:avatar.url
            }
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"Successfully Updated Avatar"))
})

const UpdatedUserCoverImage = asyncHandle(async(req,res)=>{
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(400,"cover File is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!coverImage.url){
        throw new ApiError("400","Error While Uploading On cloudinary cover Image")
    }

    const user=User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200, user ,"Successfully Updated Coverimage"))
})

const getUserChannelProfile = asyncHandle(async(req,res)=>{
    const {username} = req.params;
    if(!username?.trim){
        throw  new ApiError(400,"username is missing");
    }
        //Aggregate Pipelines
        //User.aggregate([{},{},{}])

        const channel = await User.aggregate([
            {
                $match:{
                    username:username?.toLowerCase()
                }
            },
            {
                $lookup:{
                    from:"subscriptions",
                    localField:"_id",
                    foreignField:"channel",
                    as:"subscribers"
                }
            },
            {
                $lookup:{
                    from:"subscriptions",
                    localField:"_id",
                    foreignField:"subscriber",
                    as:"subscribedTo"
                }
            },{
                $addFields:{
                    subscribersCount:{
                        $size:"$subscribers"
                    },
                    channelSubscribedToCount:{
                         $size:"$subscribedTo"
                    },
                    isSubscribed:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"],
                        then:true,
                        else:false
                        }
                    }
                }
            },{
                $project:{
                    fullname:1,
                    username:1,
                    subscribersCount:1,
                    channelSubscribedToCount:1,
                    isSubscribed:1,
                    avatar:1,
                    coverImage:1,
                    email:1
                }
            }
        ])
    
    if(!channel?.length){
        throw new ApiError(404,"Channel Does Not Exist")
    }

    return res.status(200)
             .json(
                new ApiResponse(200,channel[0],"Channel fetch Successfully")
             )
})

const getWatchHistory = asyncHandle(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },{
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1,
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },{
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        }
    ])

    res.status(200)
        .json(new ApiResponse(200,user[0].watchHistory,"Watchhistory Fetched Successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    UpdatedUserAvatar,
    UpdatedUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
};
