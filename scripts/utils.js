module.exports = {
  makeIDs,
  makeIDIterator,
};

function makeIDs(size) {
  return Array.from({ length: size }, (_, index) => index + 1);
}

function makeIDIterator(array) {
  let index = 0;

  return () => {
    const id = array[index];
    index = (index + 1) % array.length;

    return id;
  };
}
