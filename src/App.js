const express = require("express");
const cors = require("cors");
const controllers = require("./controllers");
const { error, httpError, log, pathError } = require("./middlewares");

module.exports = class App {
  app = express();

  constructor() {
    this.initPreMiddlewares();
    this.initControllers(controllers);
    this.initPostMiddlewares();
  }

  listen() {
    this.app.listen(3000, () =>
      console.info(`Listening on port 3000 (${process.env.NODE_ENV})`)
    );
  }

  initPreMiddlewares() {
    const corsOptions = {
      origin: [process.env.GUEST_LOCAL, process.env.GUEST_CLOUD],
      exposedHeaders: ["Access-Token", "Refresh-Token"],
      credentials: true,
      maxAge: process.env.ACCESS_CONTROL_MAX_AGE,
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(log);
  }

  initControllers(controllers) {
    Object.values(controllers).forEach((controller) =>
      this.app.use("/api", controller.router)
    );
  }

  initPostMiddlewares() {
    this.app.use(pathError);
    this.app.use(httpError);
    this.app.use(error);
  }
};
