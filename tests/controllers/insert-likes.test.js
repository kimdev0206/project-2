const request = require("supertest");
const App = require("../../src/App");
const database = require("../../src/database");
const {
  Delete,
  InsertBooks,
  InsertUsers,
  SelectBookIDs,
  SelectUserIDs,
} = require("../modules");

describe("[컨트롤러 계층의 통합 테스트] 좋아요", () => {
  const { app } = new App();
  const bookSize = 1;
  const userSize = 5;
  let bookIDs, bookID, userIDs;

  afterAll(async () => await database.pool.end());

  describe("[사전 작업]", () => {
    it("[사전 작업] 도서 등록", async () => {
      const params = { bookSize, userSize };
      const { affectedRows } = await InsertBooks.run(params);
      expect(affectedRows).toBe(bookSize);
    });

    it("[사전 작업] 등록된 도서 식별자 조회", async () => {
      const params = { bookSize };
      const rows = await SelectBookIDs.run(params);
      expect(rows.length).toBe(bookSize);

      bookIDs = rows.map((row) => row.bookID);
      [bookID] = bookIDs;
    });

    it("[사전 작업] 회원 가입", async () => {
      const params = { userSize };
      const { affectedRows } = await InsertUsers.run(params);
      expect(affectedRows).toBe(userSize);
    });

    it("[사전 작업] 등록된 회원 식별자 조회", async () => {
      const params = { userSize };
      const rows = await SelectUserIDs.run(params);
      expect(rows.length).toBe(userSize);

      userIDs = rows.map((row) => row.userID);
    });
  });

  describe("[동시 작업]", () => {
    it("[동시 작업] 좋아요", async () => {
      const accessTokens = userIDs.map((userID) => userID.makeJWT());
      const promises = accessTokens.map((accessToken) =>
        request(app)
          .post("/api/books" + `/${bookID}/like`)
          .set("Access-Token", accessToken)
      );

      const results = await Promise.allSettled(promises);
      results.validatePromises();
      results.forEach((result) => expect(result.value.status).toBe(201));
    });

    it("[동시 작업] 좋아요 취소", async () => {
      const accessTokens = userIDs.map((userID) => userID.makeJWT());
      const promises = accessTokens.map((accessToken) =>
        request(app)
          .delete("/api/books" + `/${bookID}/like`)
          .set("Access-Token", accessToken)
      );

      const results = await Promise.allSettled(promises);
      results.validatePromises();
      results.forEach((result) => expect(result.value.status).toBe(204));
    });
  });

  describe("[사후 작업]", () => {
    it("[사후 작업] 등록된 도서 삭제", async () => {
      const params = { table: "books", ids: bookIDs };
      const totalAffectedRows = await Delete.run(params);
      expect(totalAffectedRows).toBe(bookSize);
    });

    it("[사후 작업] 등록된 회원 삭제", async () => {
      const params = { table: "users", ids: userIDs };
      const totalAffectedRows = await Delete.run(params);
      expect(totalAffectedRows).toBe(userSize);
    });
  });
});
