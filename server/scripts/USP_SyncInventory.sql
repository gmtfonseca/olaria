DELIMITER //
DROP PROCEDURE IF EXISTS USP_SyncInventory;
CREATE PROCEDURE USP_SyncInventory (IN fishId INT, IN pondId INT)
BEGIN	
	SET @quantity = 0;
	SELECT IFNULL(SUM(quantity * CASE WHEN action = 'OUT' THEN -1 ELSE 1 END), 0) INTO @quantity
	FROM movements 
	WHERE fish_id = fishId
	AND pond_id = pondId;
		
	INSERT INTO inventories
		(fish_id, pond_id, quantity)
	VALUES
		(fishId, pondId, @quantity)
	ON DUPLICATE KEY UPDATE	
		quantity = VALUES(quantity);		
END; // 

DELIMITER ;