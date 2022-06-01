import { MovieService } from "../../../services";

export interface IMovie {
  id?: number;
  title: string;
  year: number;
  runtime: number;
  genres: string[];
  director: string;
  actors: string;
  plot: string;
  posterUrl: string;
  numberOfMatchingGenres?: number;
}

export interface IMovieResponse {
  id: string;
  title: string;
  year: string;
  runtime: string;
  genres: string[];
  director: string;
  actors: string;
  plot: string;
  posterUrl: string;
  numberOfMatchingGenres?: string;
}

export interface IMovieService {
  movieService: MovieService;
}
