const database = require("../../src/database");

module.exports = class InsertLikes {
  static makeValues(params) {
    return params.bookIDs.flatMap((bookID) =>
      params.userIDs.map((userID) => [bookID, userID])
    );
  }

  static async run(params) {
    const { pool } = database;
    const query = `
      INSERT INTO
        likes (
          liked_book_id,
          user_id
        )
      VALUES
        ?;
    `;

    const values = [this.makeValues(params)];
    const [result] = await pool.query(query, values);
    return result;
  }
};
