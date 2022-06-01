import { promises } from "fs";
import * as request from "supertest";
import Server from "../../server";
import { IMovieResponse } from "../../utils";

const server = new Server();

beforeEach(async () => {
  const dbContent = await promises.readFile(`${process.cwd()}/database/db.json`, "utf-8");
  await promises.writeFile(`${process.cwd()}/database/dbCopy.json`, dbContent);
});

afterEach(async () => {
  await promises.unlink(`${process.cwd()}/database/db.json`);
  await promises.rename(`${process.cwd()}/database/dbCopy.json`, `${process.cwd()}/database/db.json`);
});

describe("GET /movies", () => {
  it("should respond with a 201 staus code", async () => {
    const response = await request(server.app).get("/api/movies");

    expect(response.status).toBe(201);
  });

  it("should specify json in the content type header", async () => {
    const response = await request(server.app).get("/api/movies");

    expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
  });

  it("should return movies with runtime +/- 10 duration query", async () => {
    const duration = 100;
    await request(server.app)
      .get(`/api/movies?duration=${duration}`)
      .expect(201)
      .then((response) => {
        response.body.data.forEach((movie: IMovieResponse) => {
          expect(parseInt(movie.runtime)).toBeLessThanOrEqual(duration + 10);
          expect(parseInt(movie.runtime)).toBeGreaterThanOrEqual(duration - 10);
        });
      });
  });

  it("should return movies with at least one genre", async () => {
    await request(server.app)
      .get(`/api/movies?genres=Comedy,Family`)
      .expect(201)
      .then((response) => {
        response.body.data.forEach((movie: IMovieResponse) => {
          expect(movie.genres.some((genre) => ["Comedy", "Family"].includes(genre))).toBe(true);
        });
      });
  });
});

describe("POST /movies", () => {
  it("should respond with a 201 staus code", async () => {
    const response = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: "Shas",
        year: 1980,
        runtime: 60,
        genres: ["Comedy", "Crime"],
        director: "Music",
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    expect(response.status).toBe(201);
  });

  it("should respond with a 400 staus code", async () => {
    const response = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: "Shas",
        year: 1980,
        runtime: 60,
        genres: ["Comed", "Crime"],
        director: "Music",
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    expect(response.status).toBe(400);
  });

  it("should add id to movie", async () => {
    const response = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: "Shas",
        year: 1980,
        runtime: 60,
        genres: ["Comedy", "Crime"],
        director: "Music",
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    expect(response.body.data.id).toBeDefined();
  });

  it("should respond with title error message", async () => {
    const responseWithoutTitle = await request(server.app)
      .post("/api/movies/store")
      .send({
        year: 1980,
        runtime: 60,
        genres: ["Comedy", "Crime"],
        director: "Music",
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    const responseWithWrongTitle = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: 2,
        year: 1980,
        runtime: 60,
        genres: ["Comedy", "Crime"],
        director: "Music",
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    expect(responseWithoutTitle.body.message.details[0].message).toBe('"title" is required');
    expect(responseWithWrongTitle.body.message.details[0].message).toBe('"title" must be a string');
  });

  it("should respond with year error message", async () => {
    const responseWithoutYear = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: "New Title",
        runtime: 60,
        genres: ["Comedy", "Crime"],
        director: "Music",
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    const responseWithWrongYear = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: "New Title",
        year: [30],
        runtime: 60,
        genres: ["Comedy", "Crime"],
        director: "Music",
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    expect(responseWithoutYear.body.message.details[0].message).toBe('"year" is required');
    expect(responseWithWrongYear.body.message.details[0].message).toBe('"year" must be a number');
  });

  it("should respond with runtime error message", async () => {
    const responseWithoutRuntime = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: "New Title",
        year: 1980,
        genres: ["Comedy", "Crime"],
        director: "Music",
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    const responseWithWrongRuntime = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: "New Title",
        year: 1980,
        runtime: [60],
        genres: ["Comedy", "Crime"],
        director: "Music",
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    expect(responseWithoutRuntime.body.message.details[0].message).toBe('"runtime" is required');
    expect(responseWithWrongRuntime.body.message.details[0].message).toBe('"runtime" must be a number');
  });

  it("should respond with genres error message", async () => {
    const responseWithoutGenres = await request(server.app).post("/api/movies/store").send({
      title: "New Title",
      year: 1980,
      runtime: 60,
      director: "Music",
      actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
      plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
      posterUrl:
        "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
    });

    const responseWithWrongGenres = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: "New Title",
        year: 1980,
        runtime: 60,
        genres: ["Comed", "Crime"],
        director: "Music",
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    expect(responseWithoutGenres.body.message.details[0].message).toBe('"genres" is required');
    expect(responseWithWrongGenres.body.message.details[0].message).toBe(
      '"genres[0]" must be one of [Comedy, Fantasy, Crime, Drama, Music, Adventure, History, Thriller, Animation, Family, Mystery, Biography, Action, Film-Noir, Romance, Sci-Fi, War, Western, Horror, Musical, Sport]',
    );
  });

  it("should respond with director error message", async () => {
    const responseWithoutDirector = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: "New Title",
        year: 1980,
        runtime: 60,
        genres: ["Comedy", "Crime"],
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    const responseWithWrongDirector = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: "New Title",
        year: 1980,
        runtime: 60,
        genres: ["Comedy", "Crime"],
        director: 2,
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    expect(responseWithoutDirector.body.message.details[0].message).toBe('"director" is required');
    expect(responseWithWrongDirector.body.message.details[0].message).toBe('"director" must be a string');
  });

  it("should respond with actors error message", async () => {
    const responseWithWrongActors = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: "New Title",
        year: 1980,
        runtime: 60,
        genres: ["Comedy", "Crime"],
        director: "Music",
        actors: 2,
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    expect(responseWithWrongActors.body.message.details[0].message).toBe('"actors" must be a string');
  });

  it("should respond with plot error message", async () => {
    const responseWithWrongPlot = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: "New Title",
        year: 1980,
        runtime: 60,
        genres: ["Comedy", "Crime"],
        director: "Music",
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: 2,
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTY1ODI4NzYxMl5BMl5BanBnXkFtZTcwNDA4MzUxMQ@@._V1_SX300.jpg",
      });

    expect(responseWithWrongPlot.body.message.details[0].message).toBe('"plot" must be a string');
  });

  it("should respond with posterUrl error message", async () => {
    const responseWithWrongPosterUrl = await request(server.app)
      .post("/api/movies/store")
      .send({
        title: "New Title",
        year: 1980,
        runtime: 60,
        genres: ["Comedy", "Crime"],
        director: "Music",
        actors: "Richard Chamberlain, Toshirô Mifune, Yôko Shimada, Furankî Sakai",
        plot: "A English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
        posterUrl: 2,
      });

    expect(responseWithWrongPosterUrl.body.message.details[0].message).toBe('"posterUrl" must be a string');
  });
});
