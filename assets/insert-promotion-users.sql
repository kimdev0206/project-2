INSERT INTO 
  `project-2`.promotion_users (
    promotion_id,
    user_id
  )
SELECT
  2 AS promotion_id,
  u.id
FROM
  users AS u
WHERE
  u.email 
  LIKE '%@gmail.com';