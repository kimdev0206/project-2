const SelectBooksQueryBuilder = require("./select-books");

module.exports = class SelectBookCountQueryBuilder extends (
  SelectBooksQueryBuilder
) {
  setIsBest(isBest) {
    const clause = `
      ORDER BY (
          SELECT
            COUNT(*)
          FROM
            likes
          WHERE
            book_id = b.id
        ) DESC, 
        b.published_at DESC
    `;

    if (isBest) {
      this.clauses.push(clause);
    }

    return this;
  }
};
