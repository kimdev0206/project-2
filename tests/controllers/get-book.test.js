const request = require("supertest");
const jwt = require("jsonwebtoken");
const { BookCategoryID } = require("../../src/enums");
const App = require("../../src/App");
const database = require("../../src/database");
const {
  DeleteBooks,
  DeleteUsers,
  InsertBooks,
  InsertLikes,
  InsertUsers,
  InsertPromotionCategory,
  InsertPromotionUser,
  SelectBookIDs,
  SelectBookJoin,
  SelectBookSubQuery,
  SelectUserIDs,
} = require("../modules");
const { getRandomKey } = require("../utils");

describe("[컨트롤러 계층의 통합 테스트] 도서 상세 조회", () => {
  const { app } = new App();
  const categoryID = getRandomKey(BookCategoryID);
  const bookSize = 1;
  const userSize = 10_000;
  let userIDs, bookID, userID;

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

      bookID = rows[0].bookID;
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
      userID = userIDs.getRandomValue();
    });

    it("[사전 작업] 프로모션 적용", async () => {
      const params = { categoryID };
      const results = await Promise.allSettled([
        InsertPromotionCategory.run(params),
        InsertPromotionUser.run(),
      ]);

      results.validatePromises();
    });

    it("[사전 작업] 좋아요", async () => {
      const params = { bookIDs: [bookID], userIDs };
      const { affectedRows } = await InsertLikes.run(params);
      expect(affectedRows).toBe(bookSize * userSize);
    });
  });

  describe("조회 쿼리 비교", () => {
    it("[비교: 서브쿼리 방식]", async () => {
      const params = { bookID, userID };
      const [row] = await SelectBookSubQuery.run(params);
      expect(row.likes).toBe(userSize);
    });

    it("[비교: 조인 방식]", async () => {
      const params = { bookID, userID };
      const [row] = await SelectBookJoin.run(params);
      expect(row.likes).toBe(userSize);
    });

    it("[선정: 조인 방식]", async () => {
      const accessToken = jwt.sign({ userID }, process.env.JWT_PRIVATE_KEY);
      const res = await request(app)
        .get("/api/books" + `/${bookID}/authorized`)
        .set("Access-Token", accessToken);
      expect(res.status).toBe(200);
      expect(res.body.data.likes).toBe(userSize);
    });
  });

  describe("[사후 작업]", () => {
    it("[사후 작업] 등록된 도서 삭제", async () => {
      const params = { bookIDs: [bookID] };
      const { affectedRows } = await DeleteBooks.run(params);
      expect(affectedRows).toBe(bookSize);
    });

    it("[사후 작업] 등록된 회원 삭제", async () => {
      const params = { userIDs };
      const { affectedRows } = await DeleteUsers.run(params);
      expect(affectedRows).toBe(userSize);
    });
  });
});
