import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

//cors setup
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


//importing router
import userRouter from '../routers/user.routes.js'; 
import commentRoutes from "./routers/comment.routes.js";



app.use("/api/v1/user", userRouter);
app.use("/api/v1/comments", commentRoutes);


export { app };
