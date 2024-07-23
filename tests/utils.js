function getRandomKey(object) {
  const keys = Object.keys(object);
  const idx = Math.floor(Math.random() * keys.length);

  return Number(keys[idx]);
}

function makeIDs(size) {
  return Array.from({ length: size }, (_, index) => index + 1);
}

module.exports = {
  getRandomKey,
  makeIDs,
};
