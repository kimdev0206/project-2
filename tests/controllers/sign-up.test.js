const request = require("supertest");
const { fakerKO: faker } = require("@faker-js/faker");
const jwt = require("jsonwebtoken");
const App = require("../../src/App");
const database = require("../../src/database");
const { DeleteUser, Delete } = require("../modules");

describe("[컨트롤러 계층의 통합 테스트] 회원 가입", () => {
  const { app } = new App();
  const email = faker.internet.email();
  const password = faker.internet.password({ length: 24 });

  afterAll(async () => await database.pool.end());

  describe("[유효성 검사] 탈퇴한 회원 email 재가입", () => {
    let userID;

    it("[사전 작업] 회원 가입", async () => {
      const res = await request(app).post("/api/users/sign-up").send({
        email,
        password,
      });
      expect(res.status).toBe(201);
    });

    it("[사전 작업] 로그인", async () => {
      const res = await request(app).post("/api/users/log-in").send({
        email,
        password,
      });
      expect(res.status).toBe(200);

      const decodedToken = jwt.verify(
        res.headers["access-token"],
        process.env.JWT_PRIVATE_KEY
      );
      userID = decodedToken.userID;
    });

    it("[사전 작업] 회원 탈퇴", async () => {
      const params = { userID };
      const { changedRows } = await DeleteUser.run(params);
      expect(changedRows).toBe(1);
    });

    it("[유효성 검사] 탈퇴한 회원 email 재가입", async () => {
      const res = await request(app).post("/api/users/sign-up").send({
        email,
        password,
      });
      expect(res.status).toBe(201);
    });

    it("[사후 작업] 등록된 회원 삭제", async () => {
      const params = { table: "users", ids: [userID] };
      const { affectedRows } = await Delete.run(params);
      expect(affectedRows).toBe(1);
    });
  });
});
