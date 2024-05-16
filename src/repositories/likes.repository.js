const database = require("../database");

module.exports = class LikesRepository {
  database = database;

  async insertLike(param) {
    const pool = this.database.pool;
    const query = `
      INSERT INTO 
        likes
        (
          user_id, 
          liked_book_id
        )
      VALUES
        (?, ?);
    `;

    const values = [param.userID, param.bookID];
    await pool.query(query, values);
  }

  async deleteLike(param) {
    const pool = this.database.pool;
    const query = `
      DELETE
      FROM
        likes
      WHERE
        user_id = ?
        AND liked_book_id = ?;
    `;

    const values = [param.userID, param.bookID];
    const [result] = await pool.query(query, values);
    return result;
  }
};
