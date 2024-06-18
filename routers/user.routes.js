import { Router } from "express";
import { registerUser } from "../src/controllers/user.controller.js";

const router = Router();
console.log(12345);
router.route("/register").post(registerUser)
// router.router("/login").post(loginUser)

export default router;