import { asyncHandle } from "../../utils/asyncHandle.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
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

    const{fullname , email , username , password} = req.body;
    // if(fullname == ''){
    //     throw new ApiError(400,"Full Name Is Required")
    // }

    if([fullname,email,username,password].some((field)=>field?.trim() === "")){
        throw new ApiError(400,"All Fields are required")
    }

   existedUser = User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(400,"User with Eail or Username Exist!")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError("Avatar is Required!");
    }

    res.status(200).json({
        message: "ok"
    });
});

export { registerUser };
