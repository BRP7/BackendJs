import { Router } from "express";
import { registerUser } from "../src/controllers/user.controller.js";

const router = Router();

router.router("/register").post(registerUser)
// router.router("/login").post(loginUser)

export default router;