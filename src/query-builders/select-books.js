const Base = require("./base");

module.exports = class SelectBooksQueryBuilder extends Base {
  setCategoryID(categoryID) {
    if (categoryID) {
      const condition = "b.category_id = ?";
      this.conditions.push(condition);
      this.values.push(categoryID);
    }

    return this;
  }

  setIsNewPublished(isNew) {
    const condition =
      "b.published_at BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";

    if (isNew) {
      this.conditions.push(condition);
    }

    return this;
  }

  setKeyword(dao) {
    if (dao.keyword) {
      let conditions = [];

      if (dao.isTitle) {
        conditions.push("b.title LIKE ?");
        this.values.push(`%${dao.keyword}%`);
      }

      if (dao.isSummary) {
        conditions.push("b.summary LIKE ?");
        this.values.push(`%${dao.keyword}%`);
      }

      if (dao.isContents) {
        conditions.push("b.contents LIKE ?");
        this.values.push(`%${dao.keyword}%`);
      }

      if (dao.isDetail) {
        conditions.push("b.detail LIKE ?");
        this.values.push(`%${dao.keyword}%`);
      }

      if (conditions.length) {
        this.conditions.push(`(${conditions.join(" OR ")})`);
      }
    }

    return this;
  }

  setGrouping() {
    const clause = "GROUP BY b.id";
    this.clauses.push(clause);

    return this;
  }

  setIsBest(isBest) {
    const clause = "ORDER BY likes DESC, b.published_at DESC";

    if (isBest) {
      this.clauses.push(clause);
    }

    return this;
  }

  setPaging(dao) {
    if (dao.limit && dao.page) {
      const clause = "LIMIT ? OFFSET ?";
      this.clauses.push(clause);

      const offset = dao.offset || (dao.page - 1) * dao.limit;
      this.values.push(dao.limit, offset);
    }

    return this;
  }
};
