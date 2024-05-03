module.exports = class InsertDeliveries {
  constructor({ faker, deliverySize }) {
    const deliveryIDs = Array.from(
      { length: deliverySize },
      (_, index) => index + 1
    );

    const values = deliveryIDs.map((deliveryID) => [
      deliveryID,
      faker.location.streetAddress({ useFullAddress: true }),
      `${faker.person.lastName()}${faker.person.firstName()}`,
      faker.phone.number(),
    ]);

    this.values = values;
  }

  run = async ({ conn }) => {
    const query = `
      INSERT INTO deliveries
        (
          id,
          address, 
          receiver, 
          contact
        )
      VALUES    
        ?;
    `;

    const values = this.values;
    const [result] = await conn.query(query, [values]);
    return result;
  };
};
