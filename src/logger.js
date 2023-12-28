class Logger {
  init(debug) {
    this.info = debug("log:info");
    this.err = debug("log:err");
  }

  info = (msg) => this.info(msg);

  err = (msg) => this.err(msg);
}

module.exports = new Logger();
