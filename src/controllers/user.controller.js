import { asyncHandle } from "../../utils/asyncHandle.js";

const registerUser = asyncHandle(async (req, res) => {
    //get user details from front end
    //validation - not empty
    //check if already exists: username,email
    //check for images , check for avatar
    //upload them to cloudinary
    //
    res.status(200).json({
        message: "ok"
    });
});

export { registerUser };
