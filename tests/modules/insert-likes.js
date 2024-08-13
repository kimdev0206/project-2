const database = require("../../src/database");
const { getChunkSize } = require("../utils");

module.exports = class InsertLikes {
  static makeValues(params) {
    return params.userIDs.flatMap((userID) =>
      params.bookIDs.map((bookID) => [userID, bookID])
    );
  }

  static async run(params) {
    const { pool } = database;
    const query = `
      INSERT INTO
        likes (
          user_id,
          book_id
        )
      VALUES
        ?;
    `;

    const values = this.makeValues(params);
    const size = params.bookIDs.length * params.userIDs.length;
    const chunkSize = getChunkSize(size);
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
