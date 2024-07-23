function getRandomKey(object) {
  const keys = Object.keys(object);
  const idx = Math.floor(Math.random() * keys.length);

  return Number(keys[idx]);
}

function makeIDs(size) {
  return Array.from({ length: size }, (_, index) => index + 1);
}

Array.prototype.validatePromises = function () {
  this.forEach((result) => {
    if (result.status === "rejected") throw result.reason;
  });
};

module.exports = {
  getRandomKey,
  makeIDs,
};
