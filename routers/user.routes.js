import { Router } from "express";
import { registerUser } from "../src/controllers/user.controller.js";
import { upload } from "../src/middlewares/multer.middleware.js"


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

export default router;