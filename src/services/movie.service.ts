import { promises } from "fs";
import { Request } from "express";
import { IMovie } from "../utils";

export class MovieService {
  getMovies = async ({ query }: Request) => {
    const { dbFileContentJson } = await this.getContentFile("/database/db.json");
    let movies = dbFileContentJson.movies;

    if (query.duration) {
      movies = this.filterMovieByDuration(movies, query.duration as string);
    }

    if (query.genres) {
      return this.getMoviesByGenres(movies, query.genres as string);
    }

    return this.getRandomMovie(movies);
  };

  create = async (body: IMovie) => {
    const { dbFileContentJson } = await this.getContentFile("/database/db.json");
    const movies = dbFileContentJson.movies;

    const currentId: number = Math.max(...movies.map((movie: { id: number }) => movie.id)) + 1;
    body = { id: currentId, ...body };

    dbFileContentJson.movies.push(body);

    promises.writeFile(`${process.cwd()}/database/db.json`, JSON.stringify(dbFileContentJson));

    return body;
  };

  private getMoviesByGenres = (movies: IMovie[], queryGenres: string) => {
    const arrayOfQueryGenres = queryGenres.split(",");
    const moviesWithMatchingGenres: IMovie[] = [];

    movies.forEach((movie: IMovie) => {
      const numberOfMatchingGenres = movie.genres.filter((genre) => arrayOfQueryGenres.includes(genre)).length;
      if (numberOfMatchingGenres > 0) {
        movie["numberOfMatchingGenres"] = numberOfMatchingGenres;
        moviesWithMatchingGenres.push(movie);
      }
    });

    moviesWithMatchingGenres.sort((a, b) => (a.numberOfMatchingGenres! > b.numberOfMatchingGenres! ? -1 : 1));

    return moviesWithMatchingGenres;
  };

  private filterMovieByDuration = (movies: IMovie[], queryDuration: string) => {
    const range = 10;
    const duration = parseInt(queryDuration);

    const moviesWithMatchingDuration = movies.filter(
      (movie: IMovie) => movie.runtime >= duration - range && movie.runtime <= duration + range,
    );
    return moviesWithMatchingDuration;
  };

  private getRandomMovie = (movies: IMovie[]) => {
    return [movies[Math.floor(Math.random() * movies.length)]];
  };

  private getContentFile = async (filePath: string) => {
    const dbFileContent = promises.readFile(`${process.cwd() + filePath}`, { encoding: "utf-8" });
    const dbFileContentJson = JSON.parse(await dbFileContent);

    return { dbFileContentJson };
  };
}
