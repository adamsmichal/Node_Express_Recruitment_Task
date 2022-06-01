import * as express from "express";
import * as cors from "cors";
import helmet from "helmet";
import { apiErrorHandler } from "./errors/api.error.handler";
import { setup } from "./container";

setup();
import { router } from "./routes";

export default class Server {
  app: express.Application;

  constructor() {
    this.app = express();
    this.setup();
  }

  setup() {
    this.app.use(cors());
    this.app.use(
      helmet.contentSecurityPolicy({
        useDefaults: true,
      }),
    );
    this.app.use(express.json());
    this.app.use("/", router);
    this.app.use(apiErrorHandler);
  }

  run(port: number) {
    this.app.listen(port, () => {
      console.log(`The application is listening on port ${port}`);
    });
  }
}
