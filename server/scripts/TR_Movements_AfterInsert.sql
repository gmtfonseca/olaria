DELIMITER //
DROP TRIGGER IF EXISTS TR_Movements_AfterInsert;
CREATE TRIGGER TR_Movements_AfterInsert
AFTER INSERT ON movements
FOR EACH ROW
BEGIN
	CALL USP_SyncInventory(NEW.fish_id, NEW.pond_id);	
END //
DELIMITER ;

