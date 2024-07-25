const Base = require("./base");

module.exports = class SelectCartBooksBuilder extends Base {
  setUserID(userID) {
    if (userID) {
      const condition = "cb.user_id = ?";
      this.conditions.push(condition);
      this.values.push(userID);
    }

    return this;
  }

  setBookIDs(bookIDs) {
    if (bookIDs) {
      const condition = "cb.book_id IN ( ? )";
      this.conditions.push(condition);
      this.values.push(bookIDs);
    }

    return this;
  }
};
