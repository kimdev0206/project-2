const database = require("../../src/database");
const modules = require("../modules");

async function run({ conn }) {
  const [users, books, deliveries] = await Promise.all([
    modules.insertUsers.run({ conn }),
    modules.insertBooks.run({ conn }),
    modules.insertDeliveries.run({ conn }),
  ]);

  const orders = await modules.insertOrders.run({ conn });
  const orderedBooks = await modules.insertOrderedBooks.run({ conn });

  return {
    usersRows: users.affectedRows,
    booksRows: books.affectedRows,
    deliveriesRows: deliveries.affectedRows,
    ordersRows: orders.affectedRows,
    orderedBooksRows: orderedBooks.affectedRows,
  };
}

(async function () {
  const pool = await database.pool;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const {
      usersRows,
      booksRows,
      deliveriesRows,
      ordersRows,
      orderedBooksRows,
    } = await run({
      conn,
    });
    await conn.commit();

    console.log(`users 테이블에 ${usersRows} 개의 레코드가 추가되었습니다.`);
    console.log(`books 테이블에 ${booksRows} 개의 레코드가 추가되었습니다.`);
    console.log(
      `deliveries 테이블에 ${deliveriesRows} 개의 레코드가 추가되었습니다.`
    );
    console.log(`orders 테이블에 ${ordersRows} 개의 레코드가 추가되었습니다.`);
    console.log(
      `orderedBooks 테이블에 ${orderedBooksRows} 개의 레코드가 추가되었습니다.`
    );
  } catch (err) {
    await conn.rollback();

    console.error(err.message);
  } finally {
    await pool.end();
  }
})();
