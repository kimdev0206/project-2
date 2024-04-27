const express = require("express");
const cors = require("cors");
const controllers = require("./src/controllers");
const {
  log: logMiddleware,
  error: errorMiddleware,
} = require("./src/middlewares");
const logger = require("./src/logger");

module.exports = class App {
  app = express();

  constructor() {
    this.initPreMiddlewares();
    this.initControllers(controllers);
    this.initPostMiddlewares();
  }

  listen() {
    this.app.listen(3000, () => logger.info("Listening on port 3000"));
  }

  initPreMiddlewares() {
    const corsOptions = {
      origin: process.env.GUEST,
      exposedHeaders: ["Authorization", "Refresh-Token"],
      credentials: true,
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(logMiddleware);
  }

  initControllers(controllers) {
    Object.values(controllers).forEach((controller) =>
      this.app.use("/api", controller.router)
    );
  }

  initPostMiddlewares() {
    this.app.use(errorMiddleware);
  }
};
