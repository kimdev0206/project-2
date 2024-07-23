module.exports = class Base {
  constructor() {
    this.query = "";
    this.conditions = [];
    this.values = [];
    this.clauses = [];
  }

  setBaseQuery(query) {
    this.query = query;

    return (params) => {
      if (Array.isArray(params)) this.values.push(...params);
      else if (params) this.values.push(params);

      return this;
    };
  }

  build() {
    if (this.conditions.length) {
      this.query += `
        WHERE
          ${this.conditions.join(" AND ")}
      `;
    }

    if (this.clauses.length) {
      this.query += `
        ${this.clauses.join(" ")}
      `;
    }

    this.query += ";";
  }
};
