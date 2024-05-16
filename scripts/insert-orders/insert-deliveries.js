const { fakerKO: faker } = require("@faker-js/faker");
const { v1: uuid } = require("uuid");

module.exports = class InsertDeliveries {
  static size = 100;

  static makeValues() {
    const deliveryIDs = Array(this.size)
      .fill()
      .map(() => uuid());

    return deliveryIDs.map((deliveryID) => [
      deliveryID,
      faker.location.streetAddress({ useFullAddress: true }),
      `${faker.person.lastName()}${faker.person.firstName()}`,
      faker.phone.number(),
    ]);
  }

  static async run(conn) {
    const query = `
      INSERT INTO 
        deliveries
        (
          id,
          address,
          receiver,
          contact
        )
      VALUES
        ?;
    `;

    const values = this.makeValues();
    const [result] = await conn.query(query, [values]);
    return result;
  }
};
