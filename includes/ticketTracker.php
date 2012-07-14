<?php
/*
*	Remote Ticket Tracker - Server
*	Made by Thedeath
*/
require_once("./config.php");
require_once("./class.".$dbsettings["serverType"].".php");
$className = $dbsettings["serverType"]."RemoteTicketTracker";
$tracker = new $className;
$command = $_POST["c"];
if(empty($command))
{
	$command = 0;
}
if($command == 0)
	$tracker->login(true);
else
	$tracker->login();
switch($command)
{
	case 0:
		break;
	case 1:
		$tracker->showIds();
		break;
	case 2:
		if(isset($_POST["ticket"]))
		{
			$id = mysql_escape_string($_POST["ticket"]);
			$tracker->showTicketData($id);
		}
		break;
	case 3:
		if(isset($_POST["charid"]))
		{
			$id = mysql_escape_string($_POST["charid"]);
			$tracker->getCharInfo($id);
		}
		break;
	case 4:
		if(isset($_POST["ticketid"]))
		{
			$id = mysql_escape_string($_POST["ticketid"]);
			$tracker->deleteTicket($id);
		}
		break;
	case 5:
		if(isset($_POST["charid"]) && isset($_POST["gmname"]) && isset($_POST["subject"]) && isset($_POST["ticketid"]) && isset($_POST["body"]))
		{
			$char_id = mysql_escape_string($_POST["charid"]);
			$gmName = mysql_escape_string($_POST["gmname"]);
			$subject = mysql_escape_string($_POST["subject"]);
			$ticket_id = mysql_escape_string($_POST["ticketid"]);
			$mail_body = mysql_escape_string($_POST["body"]);
			$tracker->sendMail($char_id, $gmName, $subject, $ticket_id, $mail_body);
		}
}
?>