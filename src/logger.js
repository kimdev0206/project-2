const debug = require("debug");

class Logger {
  info = debug("log:info");
  error = debug("log:error");
}

module.exports = new Logger();
