module.exports = class SelectDeliveries {
  static async run(conn) {
    const query = `
      SELECT
        id
      FROM
        deliveries;
    `;

    const [result] = await conn.query(query);
    return result;
  }
};
