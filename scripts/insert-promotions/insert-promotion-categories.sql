INSERT INTO
  promotion_categories
  (
    promotion_id,
    category_id,
    book_id
  )
SELECT
  1 AS promotion_id,
  b.category_id,
  b.id
FROM
  books AS b
WHERE
  b.category_id = 1;
