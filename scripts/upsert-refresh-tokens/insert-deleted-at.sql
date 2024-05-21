CREATE TRIGGER 
  insert_deleted_at 
BEFORE INSERT ON 
  refresh_tokens
FOR EACH ROW
SET 
  NEW.deleted_at = DATE_ADD(NOW(), INTERVAL 15 DAY);