const request = require("supertest");
const App = require("../../src/App");
const database = require("../../src/database");
const {
  Delete,
  InsertBooks,
  InsertLikes,
  InsertUsers,
  SelectBookIDs,
  SelectBook,
  SelectUserIDs,
} = require("../modules");

describe("[컨트롤러 계층의 통합 테스트] 도서 상세 조회", () => {
  const { app } = new App();

  afterAll(async () => await database.pool.end());

  describe("[100개 도서 - 1000명 회원] 도서 상세 조회", () => {
    const bookSize = 100;
    const userSize = 1000;
    let bookIDs, bookID, userIDs, userID;

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
        bookID = bookIDs.getRandomValue();
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

      it("[사전 작업] 좋아요", async () => {
        const params = { bookIDs, userIDs };
        const totalAffectedRows = await InsertLikes.run(params);
        expect(totalAffectedRows).toBe(bookSize * userSize);
      });
    });

    describe("도서 상세 조회", () => {
      it("[쿼리 호출]", async () => {
        const params = { bookID, userID };
        const [row] = await SelectBook.run(params);
        expect(row.likes).toBe(userSize);
      });

      it("[API 호출]", async () => {
        const accessToken = userID.makeJWT();
        const res = await request(app)
          .get("/api/books" + `/${bookID}/authorized`)
          .set("Access-Token", accessToken);
        expect(res.status).toBe(200);
        expect(res.body.data.likes).toBe(userSize);
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

  describe("[100개 도서 - 5000명 회원] 도서 상세 조회", () => {
    const bookSize = 100;
    const userSize = 5000;
    let bookIDs, bookID, userIDs, userID;

    jest.setTimeout(15_000);

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
        bookID = bookIDs.getRandomValue();
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

      it("[사전 작업] 좋아요", async () => {
        const params = { bookIDs, userIDs };
        const totalAffectedRows = await InsertLikes.run(params);
        expect(totalAffectedRows).toBe(bookSize * userSize);
      });
    });

    describe("도서 상세 조회", () => {
      it("[쿼리 호출]", async () => {
        const params = { bookID, userID };
        const [row] = await SelectBook.run(params);
        expect(row.likes).toBe(userSize);
      });

      it("[API 호출]", async () => {
        const accessToken = userID.makeJWT();
        const res = await request(app)
          .get("/api/books" + `/${bookID}/authorized`)
          .set("Access-Token", accessToken);
        expect(res.status).toBe(200);
        expect(res.body.data.likes).toBe(userSize);
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

  describe("[1000개 도서 - 1000명 회원] 도서 상세 조회", () => {
    const bookSize = 1000;
    const userSize = 1000;
    let bookIDs, bookID, userIDs, userID;

    jest.setTimeout(50_000);

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
        bookID = bookIDs.getRandomValue();
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

      it("[사전 작업] 좋아요", async () => {
        const params = { bookIDs, userIDs };
        const totalAffectedRows = await InsertLikes.run(params);
        expect(totalAffectedRows).toBe(bookSize * userSize);
      });
    });

    describe("도서 상세 조회", () => {
      it("[쿼리 호출]", async () => {
        const params = { bookID, userID };
        const [row] = await SelectBook.run(params);
        expect(row.likes).toBe(userSize);
      });

      it("[API 호출]", async () => {
        const accessToken = userID.makeJWT();
        const res = await request(app)
          .get("/api/books" + `/${bookID}/authorized`)
          .set("Access-Token", accessToken);
        expect(res.status).toBe(200);
        expect(res.body.data.likes).toBe(userSize);
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

  describe("[1000개 도서 - 5000명 회원] 도서 상세 조회", () => {
    const bookSize = 1000;
    const userSize = 5000;
    let bookIDs, bookID, userIDs, userID;

    jest.setTimeout(1_000_000);

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
        bookID = bookIDs.getRandomValue();
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

      it("[사전 작업] 좋아요", async () => {
        const params = { bookIDs, userIDs };
        const totalAffectedRows = await InsertLikes.run(params);
        expect(totalAffectedRows).toBe(bookSize * userSize);
      });
    });

    describe("도서 상세 조회", () => {
      it("[쿼리 호출]", async () => {
        const params = { bookID, userID };
        const [row] = await SelectBook.run(params);
        expect(row.likes).toBe(userSize);
      });

      it("[API 호출]", async () => {
        const accessToken = userID.makeJWT();
        const res = await request(app)
          .get("/api/books" + `/${bookID}/authorized`)
          .set("Access-Token", accessToken);
        expect(res.status).toBe(200);
        expect(res.body.data.likes).toBe(userSize);
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
});
