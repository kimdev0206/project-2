const SelectBooksQueryBuilder = require("./select-books");

module.exports = class SelectBookCountQueryBuilder extends (
  SelectBooksQueryBuilder
) {
  setIsNewCreated(isNewCreated) {
    const condition =
      "b.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 5 SECOND) AND NOW()";

    if (isNewCreated) {
      this.conditions.push(condition);
    }

    return this;
  }
};
