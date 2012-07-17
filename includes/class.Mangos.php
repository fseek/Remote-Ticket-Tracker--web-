<?php
/*
*    Remote Ticket Tracker - Server
*    Mangos
*    Made by Thedeath
*/
require_once("./class.AbstrTicketTracker.php");
class MangosRemoteTicketTracker extends RemoteTicketTracker
{
    function showTicketData($id)
    {
        global $dbsettings;
        $values = $this->doQuery("SELECT ticket_id,guid,ticket_text,ticket_lastchange FROM `character_ticket` WHERE `ticket_id` = '".$id."';", $dbsettings["world_db"]);
        $id = mysql_fetch_array($values);
        $dataArr = $id;
        echo json_encode($dataArr);
    }

    function getCharInfo($id)
    {
        global $dbsettings;
        $sel_char_name = $this->doQuery("SELECT guid,name,online FROM characters WHERE guid = '" . $id . "' ORDER BY online DESC", $dbsettings["world_db"]);
        $id = mysql_fetch_array($sel_char_name);
        $dataArr = $id;
        echo json_encode($dataArr);
    }

    function showIds()
    {
        global $dbsettings;
        $ids = $this->doQuery("SELECT `ticket_id` FROM `character_ticket`;", $dbsettings["world_db"]);
        $idsImpl = array();
        $count = 0;
        while($id = mysql_fetch_array($ids))
        {
            $idsImpl[$count] = $id[0];
            $count = $count+1;
        }
        $jsonObj = array('ids' => $idsImpl);
        echo json_encode($jsonObj);
    }

    function checkLogin($username, $password) //$password = SHA1(CONCAT(UPPER(`username`), ':', UPPER(<pass>)));
    {
        global $dbsettings;
        $data = $this->doQuery("SELECT `gmlevel` FROM `account` WHERE `username` = '" . $username . "' AND sha_pass_hash = '" . $password . "'", $dbsettings["acc_db"]);
        if(!$data || mysql_num_rows($data) == 0)
        {
            echo "false<br>Data wrong!";
            die;
        }
        $fetch_gm_info = mysql_fetch_array($data);
        $gm_level = $fetch_gm_info['gmlevel'];
        if($gm_level == 0 || $gm_level == 1)
        {
            echo "false<br>Permission denied !";
            die;
        }
    }
    
    function sendMail($char_id, $gmName, $subject, $ticket_id, $mail_body)
    {
        global $dbsettings;
        $gmId = 1;
        $sel_mail_info = $this->doQuery("SELECT id FROM mail ORDER BY id DESC LIMIT 1", $dbsettings["world_db"]);
        $fetch_mail_info = mysql_fetch_array($sel_mail_info);
        $mail_id = $fetch_mail_info['id'];
        $mail_id2 = $mail_id + 1;
        $send_mail = $this->doQuery("INSERT INTO mail VALUES ('" . $mail_id2 . "', '0', '61', '0', '".$gmId."', '" . $char_id . "', '".$subject. "', '" . $mail_body . " \n\nThis mail was send by the Ticket Support System. If you want to answer this mail write a new ticket.', '0', '0', '0', '0', '0', '0');", $dbsettings["world_db"]);
        //deleteTicket($ticket_id);
        echo "<br>".$send_mail;
    }

    function deleteTicket($ticket_id)
    {
        global $dbsettings;
        $delete_ticket = $this->doQuery("DELETE FROM `character_ticket` WHERE `ticket_id` = '" . $ticket_id . "'", $dbsettings["world_db"]);
        echo $delete_ticket;
    }

}
?>