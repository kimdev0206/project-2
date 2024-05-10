module.exports = {
  makeIDs,
  makeIDIterator,
};

function makeIDs(end, start = 1) {
  let IDs = [];

  for (let i = start; i <= end; i += 1) IDs.push(i);

  return IDs;
}

function makeIDIterator(array) {
  let index = 0;

  return () => {
    const id = array[index];
    index = (index + 1) % array.length;

    return id;
  };
}
