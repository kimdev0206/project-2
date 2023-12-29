const debug = require("debug");

class Logger {
  constructor(debug) {
    this.info = debug("log:info");
    this.err = debug("log:err");
  }
}

module.exports = new Logger(debug);
