import { asyncHandle } from "../../utils/asyncHandle.js";

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
    res.status(200).json({
        message: "ok"
    });
});

export { registerUser };
