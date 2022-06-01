import { ApiError } from "../errors";
import { Response, Request, NextFunction } from "express";
import { MovieService } from "../services";
import { IMovieService } from "../utils";

export class MovieController {
  private movieService: MovieService;

  constructor({ movieService }: IMovieService) {
    this.movieService = movieService;
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.movieService.getMovies(req);

      if (result.length === 0) {
        next(ApiError.noMatchingResult("Not found any result"));
        return;
      }

      res.status(201).json({ message: "Movies has been found", data: result });
    } catch (err) {
      next(err);
    }
  };

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.movieService.create(req.body);
      res.status(201).json({ message: "Movie has been added", data: result });
    } catch (err) {
      next(err);
    }
  };
}
