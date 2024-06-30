import { Router } from "express";
import { registerUser,loginUser,logoutUser } from "../src/controllers/user.controller.js";
import { upload } from "../src/middlewares/multer.middleware.js"
import { verifyJwt } from "../src/middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ])
    ,registerUser)
// router.router("/login").post(loginUser)

router.route("/login").post(loginUser) 

//secured routes
router.route("/logout").post(verifyJwt,logoutUser) 

export default router;