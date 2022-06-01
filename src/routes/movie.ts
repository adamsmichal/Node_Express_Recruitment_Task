import { Router } from "express";
import { container } from "../container";
import { synchronizeGenres, validate } from "../middleware";
import { CreateMovieShema } from "../utils";

const movieController = container.resolve("movieController");
const movieRouter = Router();

movieRouter.get("/", movieController.index);
movieRouter.post("/store", [synchronizeGenres(), validate(CreateMovieShema)], movieController.store);

export default movieRouter;
