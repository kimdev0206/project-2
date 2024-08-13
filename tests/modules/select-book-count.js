const { SelectBookCountQueryBuilder } = require("../../src/query-builders");
const database = require("../../src/database");

module.exports = class SelectBookCount {
  static async run(params) {
    const builder = new SelectBookCountQueryBuilder();
    const baseQuery = `
      SELECT
        COUNT(*) AS counted
      FROM
        books AS b
    `;

    builder
      .setBaseQuery(baseQuery)()
      .setCategoryID(params.categoryID)
      .setIsNewPublished(params.isNew)
      .setKeyword(params)
      .setIsNewCreated(params.isNewCreated)
      .build();

    const { pool } = database;
    const [result] = await pool.query(builder.query, builder.values);
    return result;
  }
};
