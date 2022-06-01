import { createContainer, InjectionMode, asClass } from "awilix";
import { MovieController } from "./controllers";
import { MovieService } from "./services";

export const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

export const setup = () => {
  container.register({
    // controllers
    movieController: asClass(MovieController),

    // services
    movieService: asClass(MovieService),
  });
};
