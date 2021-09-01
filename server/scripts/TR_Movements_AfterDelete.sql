DELIMITER //
DROP TRIGGER IF EXISTS TR_Movements_AfterDelete;
CREATE TRIGGER TR_Movements_AfterDelete
AFTER DELETE ON movements
FOR EACH ROW
BEGIN
	CALL USP_SyncInventory(OLD.fish_id, OLD.pond_id);	
END //
DELIMITER ;