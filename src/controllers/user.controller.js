import { asyncHandle } from "../../utils/asyncHandle.js";

const registerUser = asyncHandle(async (req, res) => {
    //get user details from front end
    //validation - not empty
    //check if already exist
    
    res.status(200).json({
        message: "ok"
    });
});

export { registerUser };
