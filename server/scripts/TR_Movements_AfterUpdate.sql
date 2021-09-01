# # TR_Movements_AfterUpdate
DELIMITER //
DROP TRIGGER IF EXISTS TR_Movements_AfterUpdate;
CREATE TRIGGER TR_Movements_AfterUpdate
AFTER UPDATE ON movements
FOR EACH ROW
BEGIN
	CALL USP_SyncInventory(NEW.fish_id, NEW.pond_id);
    
	IF OLD.fish_id != NEW.fish_id OR OLD.pond_id != NEW.pond_id THEN
		CALL USP_SyncInventory(OLD.fish_id, OLD.pond_id);
  END IF;
END //
DELIMITER ;
