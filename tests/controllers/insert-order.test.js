const request = require("supertest");
const jwt = require("jsonwebtoken");
const App = require("../../src/App");
const database = require("../../src/database");
const {
  Delete,
  InsertBooks,
  InsertUsers,
  SelectBookIDs,
  SelectRandomBooks,
  SelectUserIDs,
} = require("../modules");
const { makeDeliveries, makeOrderIDs } = require("../utils");

describe("[컨트롤러 계층의 통합 테스트] 주문", () => {
  const { app } = new App();
  const bookSize = 1;
  const userSize = 5;
  let bookIDs, userIDs;

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

      userIDs = rows.map((row) => row.userID);
    });
  });

  describe("동시 주문", () => {
    let body;

    it("[사전 작업] 주문 입력값", async () => {
      const params = { amount: bookSize, count: bookSize };
      const [row] = await SelectRandomBooks.run(params);
      const [delivery] = makeDeliveries(1);

      body = {
        mainBookTitle: row.title,
        books: [
          {
            count: 1,
            price: row.price,
            title: row.title,
            author: row.author,
            bookID: row.bookID,
          },
        ],
        delivery,
        totalCount: 1,
        totalPrice: row.price,
      };
    });

    it("동시 주문", async () => {
      const orderIDs = makeOrderIDs(userSize);
      const accessTokens = userIDs.map((userID) =>
        jwt.sign({ userID }, process.env.JWT_PRIVATE_KEY)
      );
      const promises = orderIDs.map((orderID, index) =>
        request(app)
          .post("/api/orders" + `/${orderID}`)
          .set("Access-Token", accessTokens[index])
          .send(body)
      );

      const results = await Promise.allSettled(promises);
      results.validatePromises();
      results.forEach((result) => expect(result.value.status).toBe(201));
    });
  });

  describe("중복 주문", () => {
    const [orderID] = makeOrderIDs(bookSize);
    let body;

    it("[사전 작업] 주문 입력값", async () => {
      const params = { amount: bookSize, count: bookSize };
      const [row] = await SelectRandomBooks.run(params);
      const [delivery] = makeDeliveries(1);

      body = {
        mainBookTitle: row.title,
        books: [
          {
            count: 1,
            price: row.price,
            title: row.title,
            author: row.author,
            bookID: row.bookID,
          },
        ],
        delivery,
        totalCount: 1,
        totalPrice: row.price,
      };
    });

    it("[사전 작업] 주문", async () => {
      const [userID] = userIDs;
      const accessToken = jwt.sign({ userID }, process.env.JWT_PRIVATE_KEY);
      const res = await request(app)
        .post("/api/orders" + `/${orderID}`)
        .set("Access-Token", accessToken)
        .send(body);
      expect(res.status).toBe(201);
    });

    it("중복 주문", async () => {
      const [userID] = userIDs;
      const accessToken = jwt.sign({ userID }, process.env.JWT_PRIVATE_KEY);
      const res = await request(app)
        .post("/api/orders" + `/${orderID}`)
        .set("Access-Token", accessToken)
        .send(body);
      expect(res.status).toBe(409);
    });
  });

  describe("[사후 작업]", () => {
    it("[사후 작업] 등록된 도서 삭제", async () => {
      const params = { table: "books", ids: bookIDs };
      const { affectedRows } = await Delete.run(params);
      expect(affectedRows).toBe(bookSize);
    });

    it("[사후 작업] 등록된 회원 삭제", async () => {
      const params = { table: "users", ids: userIDs };
      const { affectedRows } = await Delete.run(params);
      expect(affectedRows).toBe(userSize);
    });
  });
});
