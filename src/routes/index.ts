import { Router } from "express";
import movieRouter from "./movie";

export const router = Router();
router.use("/api/movies", movieRouter);
