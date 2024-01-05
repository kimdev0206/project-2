module.exports = class LikesRepository {
  constructor(database) {
    this.database = database;
  }

  insertLike = async (param) => {
    const pool = await this.database.pool;
    const query = `
      INSERT INTO likes
        (user_id, liked_book_id)
      VALUES
        (?, ?);
    `;

    const values = [param.userID, param.bookID];
    await pool.query(query, values);
  };

  deleteLike = async (param) => {
    const pool = await this.database.pool;
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
  };
};
