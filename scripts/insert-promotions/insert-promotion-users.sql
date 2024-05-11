INSERT INTO 
	applied_promotions
	(
		promotion_id, 
		user_id, 
		book_id
	)
SELECT
  2 AS promotion_id,
	u.id,
	b.id
FROM
	users AS u
JOIN
	books AS b 
WHERE
  u.email 
  LIKE '%@gmail.com';