const request = require("supertest");
const jwt = require("jsonwebtoken");
const App = require("../../src/App");
const database = require("../../src/database");
const {
  Delete,
  InsertBooks,
  InsertOrders,
  InsertUsers,
  SelectBookIDs,
  SelectUserIDs,
} = require("../modules");

describe("[컨트롤러 계층의 통합 테스트] 주문 목록 조회", () => {
  const { app } = new App();
  const bookSize = 100;
  const userSize = 1;
  const orderSize = 10;
  let bookIDs, userID, orderIDs;

  afterAll(async () => await database.pool.end());

  describe("[사전 작업]", () => {
    it("[사전 작업] 도서 등록", async () => {
      const params = { bookSize };
      const { affectedRows } = await InsertBooks.run(params);
      expect(affectedRows).toBe(bookSize);
    });

    it("[사전 작업] 등록된 도서 식별자 조회", async () => {
      const params = { bookSize };
      const rows = await SelectBookIDs.run(params);
      expect(rows.length).toBe(bookSize);

      bookIDs = rows.map((row) => row.bookID);
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

      const userIDs = rows.map((row) => row.userID);
      userID = userIDs.getRandomValue();
    });

    it.skip("[사전 작업] 도서 수량 변경", async () => {
      const params = { bookIDs };
      const { changedRows } = await UpdateBookCount.run(params);
      expect(changedRows).toBe(bookSize);
    });

    it("[사전 작업] 주문", async () => {
      const params = { userIDs: [userID], orderIDs, orderSize, bookSize };
      const { affectedRows } = await InsertOrders.run(params);
      expect(affectedRows).toBe(orderSize);
    });
  });

  describe("주문 목록 조회", () => {
    it("주문 목록 조회", async () => {
      const accessToken = jwt.sign({ userID }, process.env.JWT_PRIVATE_KEY);
      const res = await request(app)
        .get("/api/orders")
        .set("Access-Token", accessToken);
      expect(res.status).toBe(200);
    });
  });

  describe("[사후 작업]", () => {
    it("[사후 작업] 등록된 도서 삭제", async () => {
      const params = { table: "books", ids: bookIDs };
      const { affectedRows } = await Delete.run(params);
      expect(affectedRows).toBe(bookSize);
    });

    it("[사후 작업] 등록된 회원 삭제", async () => {
      const params = { table: "users", ids: [userID] };
      const { affectedRows } = await Delete.run(params);
      expect(affectedRows).toBe(userSize);
    });
  });
});
