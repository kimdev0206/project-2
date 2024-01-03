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

  selectBooksByCategoryID = async (param) => {
    const pool = await this.database.pool;
    const query = `
      SELECT
        id,
        title,
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
        category_id = ?;
    `;

    const values = [param.categoryID];
    const [result] = await pool.query(query, values);
    return result;
  };

  selectBook = async (param) => {
    const pool = await this.database.pool;
    const query = `
      SELECT
        b.id,
        b.title,
        c.category,
        b.img_id AS imgID,
        b.form,
        b.isbn,
        b.summary,
        b.detail,
        b.author,
        b.pages,
        b.contents,
        b.price,
        b.pub_date AS pubDate
      FROM
        categories AS c
      LEFT JOIN
        books AS b
        ON c.id = b.category_id
      WHERE
        b.id = ?;
    `;

    const values = [param.bookID];
    const [result] = await pool.query(query, values);
    return result;
  };
};
