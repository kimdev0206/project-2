const database = require("../../src/database");

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

    const values = [this.makeValues(params)];
    const [result] = await pool.query(query, values);
    return result;
  }
};
