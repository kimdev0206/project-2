INSERT INTO
	applied_promotions
	(
		promotion_id,
		user_id,
		book_id
	)
SELECT
	1 AS promotion_id,
	u.id,
	b.id
FROM
	users AS u
CROSS JOIN
	books AS b
WHERE
	b.category_id = 1;