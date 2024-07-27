const database = require("../../src/database");

module.exports = class Delete {
  static async run(params) {
    const { pool } = database;
    const query = `
      DELETE
      FROM
        ${params.table}
      WHERE
        id IN (?);
    `;

    const values = params.ids;
    const size = params.ids.length;
    const chunkSize = size % 100 ? size / 10 : size / 100;
    let promises = [];

    for (let i = 0; i < size; i += chunkSize) {
      const slicedValues = [values.slice(i, i + chunkSize)];
      const promise = pool.query(query, slicedValues);
      promises.push(promise);
    }

    const results = await Promise.allSettled(promises);
    results.validatePromises();

    const totalAffectedRows = results.reduce((prev, cur) => {
      const [row] = cur.value;
      return prev + row.affectedRows;
    }, 0);

    return totalAffectedRows;
  }
};
