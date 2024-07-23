const request = require("supertest");
const { BookCategoryID } = require("../../src/enums");
const App = require("../../src/App");
const database = require("../../src/database");
const {
  DeleteBooks,
  DeleteUsers,
  InsertBooks,
  InsertLikes,
  InsertPromotionCategory,
  InsertPromotionUser,
  InsertUsers,
  SelectBookCount,
  SelectBookIDs,
  SelectBooksJoin,
  SelectBooksSubQuery,
  SelectUserIDs,
} = require("../modules");
const { getRandomKey } = require("../utils");

describe("[컨트롤러 계층의 통합 테스트] 도서 목록 조회", () => {
  const { app } = new App();
  const bookLimit = 10;
  const keyword = "인";

  afterAll(async () => await database.pool.end());

  describe("[100개 도서 - 1000명 회원] 조회 쿼리 비교", () => {
    const categoryID = getRandomKey(BookCategoryID);
    const bookSize = 100;
    const userSize = 1000;
    let bookIDs, userIDs;

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

      it("[사전 작업] 프로모션 적용", async () => {
        const params = { categoryID };
        const results = await Promise.allSettled([
          InsertPromotionCategory.run(params),
          InsertPromotionUser.run(),
        ]);

        results.validatePromises();
      });

      it("[사전 작업] 좋아요", async () => {
        const params = { bookIDs, userIDs };
        const { affectedRows } = await InsertLikes.run(params);
        expect(affectedRows).toBe(bookSize * userSize);
      });
    });

    describe("전체 조회", () => {
      it("[비교: 서브쿼리 방식] 전체 조회", async () => {
        const params = { limit: bookSize, page: 1 };
        const rows = await SelectBooksSubQuery.run(params);
        expect(rows.length).toBe(bookSize);
      });

      it("[비교: 조인 방식] 전체 조회", async () => {
        const params = { limit: bookSize, page: 1 };
        const rows = await SelectBooksJoin.run(params);
        expect(rows.length).toBe(bookSize);
      });

      it("[선정: 서브쿼리 방식] 전체 조회", async () => {
        const res = await request(app).get("/api/books").query({
          limit: bookSize,
          page: 1,
        });

        expect(res.body.data.length).toBe(bookSize);
      });
    });

    describe("부분 조회 (첫 페이지)", () => {
      it("[비교: 서브쿼리 방식] 부분 조회 (첫 페이지)", async () => {
        const params = { limit: bookLimit, page: 1 };
        const rows = await SelectBooksSubQuery.run(params);
        expect(rows.length).toBe(bookLimit);
      });

      it("[비교: 조인 방식] 부분 조회 (첫 페이지)", async () => {
        const params = { limit: bookLimit, page: 1 };
        const rows = await SelectBooksJoin.run(params);
        expect(rows.length).toBe(bookLimit);
      });

      it("[선정: 서브쿼리 방식] 부분 조회 (첫 페이지)", async () => {
        const res = await request(app).get("/api/books").query({
          limit: bookLimit,
          page: 1,
        });

        expect(res.body.data.length).toBe(bookLimit);
      });
    });

    describe("부분 조회 (중간 페이지)", () => {
      it("[비교: 서브쿼리 방식] 부분 조회 (중간 페이지)", async () => {
        const params = { limit: bookLimit, page: bookSize / bookLimit / 2 };
        const rows = await SelectBooksSubQuery.run(params);
        expect(rows.length).toBe(bookLimit);
      });

      it("[비교: 조인 방식] 부분 조회 (중간 페이지)", async () => {
        const params = { limit: bookLimit, page: bookSize / bookLimit / 2 };
        const rows = await SelectBooksJoin.run(params);
        expect(rows.length).toBe(bookLimit);
      });

      it("[선정: 서브쿼리 방식] 부분 조회 (중간 페이지)", async () => {
        const res = await request(app)
          .get("/api/books")
          .query({
            limit: bookLimit,
            page: bookSize / bookLimit / 2,
          });

        expect(res.body.data.length).toBe(bookLimit);
      });
    });

    describe("부분 조회 (마지막 페이지)", () => {
      it("[비교: 서브쿼리 방식] 부분 조회 (마지막 페이지)", async () => {
        const params = { limit: bookLimit, page: bookSize / bookLimit };
        const rows = await SelectBooksSubQuery.run(params);
        expect(rows.length).toBe(bookLimit);
      });

      it("[비교: 조인 방식] 부분 조회 (마지막 페이지)", async () => {
        const params = { limit: bookLimit, page: bookSize / bookLimit };
        const rows = await SelectBooksJoin.run(params);
        expect(rows.length).toBe(bookLimit);
      });

      it("[선정: 서브쿼리 방식] 부분 조회 (마지막 페이지)", async () => {
        const res = await request(app)
          .get("/api/books")
          .query({
            limit: bookLimit,
            page: bookSize / bookLimit,
          });

        expect(res.body.data.length).toBe(bookLimit);
      });
    });

    describe("검색어 검색", () => {
      const isTitle = true;
      const isSummary = true;
      const isContents = true;
      const isDetail = true;
      let counted;

      it("[사전 작업] 검색 개수 조회", async () => {
        const params = { keyword, isTitle, isSummary, isContents, isDetail };
        const [row] = await SelectBookCount.run(params);
        expect(row).not.toBeUndefined();

        counted = row.counted;
      });

      it("[비교: 서브쿼리 방식] 검색어 검색", async () => {
        const params = { keyword, isTitle, isSummary, isContents, isDetail };
        const rows = await SelectBooksSubQuery.run(params);
        expect(rows.length).toBe(counted);
      });

      it("[비교: 조인 방식] 검색어 검색", async () => {
        const params = { keyword, isTitle, isSummary, isContents, isDetail };
        const rows = await SelectBooksJoin.run(params);
        expect(rows.length).toBe(counted);
      });

      it("[선정: 서브쿼리 방식] 검색어 검색", async () => {
        const res = await request(app).get("/api/books").query({
          keyword,
          isTitle,
          isSummary,
          isContents,
          isDetail,
          limit: counted,
          page: 1,
        });

        expect(res.body.data.length).toBe(counted);
      });
    });

    describe("특정 카테고리 식별자 검색", () => {
      let counted;

      it("[사전 작업] 검색 개수 조회", async () => {
        const params = { categoryID };
        const [row] = await SelectBookCount.run(params);
        expect(row).not.toBeUndefined();

        counted = row.counted;
      });

      it("[비교: 서브쿼리 방식] 특정 카테고리 식별자 검색", async () => {
        const params = { categoryID };
        const rows = await SelectBooksSubQuery.run(params);
        expect(rows.length).toBe(counted);
      });

      it("[비교: 조인 방식] 특정 카테고리 식별자 검색", async () => {
        const params = { categoryID };
        const rows = await SelectBooksJoin.run(params);
        expect(rows.length).toBe(counted);
      });

      it("[선정: 서브쿼리 방식] 특정 카테고리 식별자 검색", async () => {
        const res = await request(app).get("/api/books").query({
          categoryID,
          limit: counted,
          page: 1,
        });

        expect(res.body.data.length).toBe(counted);
      });
    });

    describe("인기순 정렬", () => {
      const isBest = true;
      let counted;

      it("[사전 작업] 검색 개수 조회", async () => {
        const params = { isBest };
        const [row] = await SelectBookCount.run(params);
        expect(row).not.toBeUndefined();

        counted = row.counted;
      });

      it("[비교: 서브쿼리 방식] 인기순 정렬", async () => {
        const params = { isBest };
        const rows = await SelectBooksSubQuery.run(params);
        expect(rows.length).toBe(counted);
      });

      it("[비교: 조인 방식] 인기순 정렬", async () => {
        const params = { isBest };
        const rows = await SelectBooksJoin.run(params);
        expect(rows.length).toBe(counted);
      });

      it("[선정: 서브쿼리 방식] 인기순 정렬", async () => {
        const res = await request(app).get("/api/books").query({
          isBest,
          limit: counted,
          page: 1,
        });

        expect(res.body.data.length).toBe(counted);
      });
    });

    describe("다중 조건 검색", () => {
      const isNew = true;
      const isBest = true;
      const isDetail = true;
      let counted;

      it("[사전 작업] 검색 개수 조회", async () => {
        const params = { categoryID, isNew, isBest, keyword, isDetail };
        const [row] = await SelectBookCount.run(params);
        expect(row).not.toBeUndefined();

        counted = row.counted;
      });

      it("[비교: 서브쿼리 방식] 다중 조건 검색", async () => {
        const params = { categoryID, isNew, isBest, keyword, isDetail };
        const rows = await SelectBooksSubQuery.run(params);
        expect(rows.length).toBe(counted);
      });

      it("[비교: 조인 방식] 다중 조건 검색", async () => {
        const params = { categoryID, isNew, isBest, keyword, isDetail };
        const rows = await SelectBooksJoin.run(params);
        expect(rows.length).toBe(counted);
      });

      it("[선정: 서브쿼리 방식] 다중 조건 검색", async () => {
        const res = await request(app).get("/api/books").query({
          categoryID,
          isNew,
          isBest,
          keyword,
          isDetail,
          limit: counted,
          page: 1,
        });

        if (res.status === 200) {
          expect(res.body.data.length).toBe(counted);
        } else if (res.status === 404) {
          expect(res.body).toBeUndefined();
        } else throw res.error;
      });
    });

    describe("[사후 작업]", () => {
      it("[사후 작업] 등록된 도서 삭제", async () => {
        const params = { bookIDs };
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
});
