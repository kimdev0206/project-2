const database = require("../database");

module.exports = class LikesRepository {
  database = database;

  async insertLike(dao) {
    const { pool } = this.database;
    const query = `
      INSERT INTO 
        likes (
          user_id,
          book_id
        )
      VALUES
        (?, ?);
    `;

    const values = [dao.userID, dao.bookID];
    await pool.query(query, values);
  }

  async deleteLike(dao) {
    const { pool } = this.database;
    const query = `
      DELETE
      FROM
        likes
      WHERE
        user_id = ?
        AND book_id = ?;
    `;

    const values = [dao.userID, dao.bookID];
    const [result] = await pool.query(query, values);
    return result;
  }
};
