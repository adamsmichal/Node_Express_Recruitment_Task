import { Request, Response, NextFunction } from "express";
import { promises } from "fs";

export const synchronizeGenres = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dbFileContent = promises.readFile(`${process.cwd()}/database/db.json`, { encoding: "utf-8" });
    const dbFileContentJson = JSON.parse(await dbFileContent);
    const originalVailationGenres = dbFileContentJson.genres;

    const validationGenresFileContent = promises.readFile(`${process.cwd()}/database/validationGenres.json`, {
      encoding: "utf-8",
    });
    const validationGenresFileContentJson = JSON.parse(await validationGenresFileContent);
    const validationGenres = validationGenresFileContentJson.genres;

    if (originalVailationGenres !== validationGenres) {
      await promises.writeFile(
        `${process.cwd()}/database/validationGenres.json`,
        JSON.stringify({ genres: originalVailationGenres }),
      );
    }

    next();
  };
};
