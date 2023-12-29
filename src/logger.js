const debug = require("debug");

class Logger {
  constructor(debug) {
    this.info = debug("log:info");
    this.err = debug("log:err");
  }

  info = (msg) => this.info(msg);

  err = (msg) => this.err(msg);
}

module.exports = new Logger(debug);
