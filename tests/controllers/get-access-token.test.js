const request = require("supertest");
const { fakerKO: faker } = require("@faker-js/faker");
const jwt = require("jsonwebtoken");
const App = require("../../src/App");
const database = require("../../src/database");
const { Delete } = require("../modules");

describe("[컨트롤러 계층의 통합 테스트] 접근 토큰 재발급", () => {
  const { app } = new App();
  const email = faker.internet.email();
  const password = faker.internet.password({ length: 24 });
  let accessToken, refreshToken, userID;

  afterAll(async () => await database.pool.end());

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

    accessToken = res.headers["access-token"];
    refreshToken = res.headers["refresh-token"];

    const decodedToken = jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY);
    userID = decodedToken.userID;
  });

  it("[성공] 접근 토큰 재발급", async () => {
    const res = await request(app)
      .get("/api/users/access-token")
      .set("Access-Token", accessToken)
      .set("Refresh-Token", refreshToken);
    expect(res.status).toBe(200);

    const decodedToken = jwt.verify(
      res.headers["access-token"],
      process.env.JWT_PRIVATE_KEY
    );
    expect(decodedToken.userID).toBe(userID);
  });

  it("[사후 작업] 회원 레코드 삭제", async () => {
    const params = { table: "users", ids: [userID] };
    const totalAffectedRows = await Delete.run(params);
    expect(totalAffectedRows).toBe(1);
  });
});
