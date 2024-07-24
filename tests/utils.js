const { fakerKO: faker } = require("@faker-js/faker");
const { v1: uuidv1 } = require("uuid");

module.exports = {
  getRandomKey,
  makeIDs,
  makeDeliveries,
  makeOrderIDs,
};

function getRandomKey(object) {
  const keys = Object.keys(object);
  const idx = Math.floor(Math.random() * keys.length);

  return Number(keys[idx]);
}

function makeIDs(size) {
  return Array.from({ length: size }, (_, index) => index + 1);
}

function makeDeliveries(size) {
  return Array.from({ length: size }, () => ({
    address: faker.location.streetAddress({ useFullAddress: true }),
    receiver: `${faker.person.lastName()}${faker.person.firstName()}`,
    contact: faker.phone.number(),
  }));
}

function makeOrderIDs(size) {
  return Array.from({ length: size }, () => uuidv1());
}

Array.prototype.validatePromises = function () {
  this.forEach((result) => {
    if (result.status === "rejected") throw result.reason;
  });
};

Array.prototype.getRandomValue = function () {
  const idx = Math.floor(Math.random() * this.length);
  return this[idx];
};

Array.prototype.makeIDIterator = function () {
  let index = 0;

  return () => {
    const id = this[index];
    index = (index + 1) % this.length;

    return id;
  };
};
