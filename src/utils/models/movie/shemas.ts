import { readFileSync } from "fs";
import * as joi from "joi";

const checkGenres = () => {
  /* I chose the synchronous solution here because I had a problem with
  reading genres asynchronously and adding them to the schema. In order not to have to download a large file,
  I created a middleware that syncs addictional file with the original one. When developing the application in the future,
  I would use this middleware during adding new geners to the db */
  const validationGenresFileContent = readFileSync(`${process.cwd()}/database/db.json`, "utf-8");
  return JSON.parse(validationGenresFileContent).genres;
};

export const CreateMovieShema = joi.object({
  genres: joi
    .array()
    .items(joi.string().valid(...checkGenres()))
    .required(),
  title: joi.string().required(),
  year: joi.number().required(),
  runtime: joi.number().required(),
  director: joi.string().max(255).required(),
  actors: joi.string(),
  plot: joi.string(),
  posterUrl: joi.string(),
});
