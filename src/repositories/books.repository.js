module.exports = class BooksRepository {
  constructor(database) {
    this.database = database;
  }

  selectBooks = async () => {
    const pool = await this.database.pool;
    const query = `
      SELECT
        id,
        title,
        category_id AS categoryID,
        img_id AS imgID,
        form,
        isbn,
        summary,
        detail,
        author,
        pages,
        contents,
        price,
        pub_date AS pubDate
      FROM
        books;
    `;

    const [result] = await pool.query(query);
    return result;
  };

  selectBook = async (param) => {
    const pool = await this.database.pool;
    const query = `
      SELECT
        id,
        title,
        category_id AS categoryID,
        img_id AS imgID,
        form,
        isbn,
        summary,
        detail,
        author,
        pages,
        contents,
        price,
        pub_date AS pubDate
      FROM
        books
      WHERE
        id = ?;
    `;

    const values = [param.bookID];
    const [result] = await pool.query(query, values);
    return result;
  };
};
