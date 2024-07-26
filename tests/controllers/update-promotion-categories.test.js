const database = require("../../src/database");
const {
  DeletePromotionCategories,
  Delete,
  InsertBooks,
  InsertPromotionCategories,
  SelectBookCount,
  SelectBookIDs,
} = require("../modules");

describe("[컨트롤러 계층의 통합 테스트] 카테고리 프로모션 변경", () => {
  const bookSize = 10;
  const oldCategoryID = 1;
  const newCategoryID = 2;
  let bookIDs;
  let deletedCount, insertedCount;

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

    it("[사전 작업] 프로모션 적용된 데이터 개수 조회", async () => {
      const params = { categoryID: oldCategoryID, isNewCreated: true };
      const [row] = await SelectBookCount.run(params);
      expect(row).not.toBeUndefined();

      deletedCount = row.counted;
    });

    it("[사전 작업] 프로모션 적용될 데이터 개수 조회", async () => {
      const params = { categoryID: newCategoryID, isNewCreated: true };
      const [row] = await SelectBookCount.run(params);
      expect(row).not.toBeUndefined();

      insertedCount = row.counted;
    });
  });

  describe("카테고리 프로모션 변경", () => {
    it("프로모션 적용된 데이터 제거", async () => {
      const params = { categoryID: oldCategoryID };
      const { affectedRows } = await DeletePromotionCategories.run(params);
      expect(affectedRows).toBe(deletedCount);
    });

    it("프로모션 적용될 데이터 추가", async () => {
      const params = { categoryID: newCategoryID };
      const { affectedRows } = await InsertPromotionCategories.run(params);
      expect(affectedRows).toBe(insertedCount);
    });
  });

  describe("[사후 작업]", () => {
    it("[사후 작업] 등록된 도서 삭제", async () => {
      const params = { table: "books", ids: bookIDs };
      const { affectedRows } = await Delete.run(params);
      expect(affectedRows).toBe(bookSize);
    });
  });
});
