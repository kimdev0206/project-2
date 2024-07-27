CREATE VIEW active_promotions AS
SELECT
  p.id,
  p.discount_rate,
  pu.user_id,
  pc.category_id
FROM
  promotions AS p
LEFT JOIN
  promotion_users AS pu 
  ON p.id = pu.promotion_id
LEFT JOIN
  promotion_categories AS pc 
  ON p.id = pc.promotion_id
WHERE
  p.start_at IS NULL 
  OR NOW() BETWEEN p.start_at AND p.end_at;