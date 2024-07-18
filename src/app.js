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
import commentRoutes from "../routers/comment.routes.js";
// import likeRoutes from "../routers/like.router.js";
import likeRoutes from "../routers/like.routes.js";
import playlistRoutes from "../routers/playlist.router.js";
import healthcheckRoutes from "../routers/healthcheck.router.js";
import dashboardRoutes from "../routers/dashboard.router.js";


app.use("/api/v1/user", userRouter);
app.use("/api/v1/comments", commentRoutes);
app.use('/api/v1/likes', likeRoutes);
app.use('/api/v1/playlists', playlistRoutes);
app.use('/api/v1/healthcheck', healthcheckRoutes);
app.use('/api', dashboardRoutes);

export { app };
