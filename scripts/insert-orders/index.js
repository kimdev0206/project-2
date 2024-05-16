const InsertBooks = require("./insert-books");
const InsertDeliveries = require("./insert-deliveries");
const InsertOrders = require("./insert-orders");
const InsertUsers = require("./insert-users");
const SelectDeliveries = require("./select-deliveries");
const database = require("../../src/database");

async function run(conn) {
  const [users, books, deliveries] = await Promise.all([
    InsertUsers.run(conn),
    InsertBooks.run(conn),
    InsertDeliveries.run(conn),
  ]);

  const deliveryIDs = (await SelectDeliveries.run(conn)).map((each) => each.id);
  const orders = await InsertOrders.run(conn, deliveryIDs);

  return {
    usersRows: users.affectedRows,
    booksRows: books.affectedRows,
    deliveriesRows: deliveries.affectedRows,
    ordersRows: orders.affectedRows,
  };
}

(async function () {
  const pool = database.pool;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const { usersRows, booksRows, deliveriesRows, ordersRows } = await run(
      conn
    );

    await conn.commit();

    console.log(`users 테이블에 ${usersRows} 개의 레코드가 추가되었습니다.`);
    console.log(`books 테이블에 ${booksRows} 개의 레코드가 추가되었습니다.`);
    console.log(
      `deliveries 테이블에 ${deliveriesRows} 개의 레코드가 추가되었습니다.`
    );
    console.log(`orders 테이블에 ${ordersRows} 개의 레코드가 추가되었습니다.`);
  } catch (error) {
    await conn.rollback();

    console.error(error.message);
  } finally {
    await pool.end();
  }
})();
