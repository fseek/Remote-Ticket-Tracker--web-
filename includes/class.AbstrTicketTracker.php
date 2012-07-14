<?php
/*
*	Remote Ticket Tracker - Server
*	Made by Thedeath
*/
require_once("./config.php");
abstract class RemoteTicketTracker
{
	//the method which checks the login information
	abstract protected function checkLogin($username, $password);
	//print some(ticket_id, guid, ticket_text, ticket_lastchange) information about a ticket as a json string
	abstract protected function showTicketData($id);
	//print some(guid, name, online) information about a ticket as a json string
	abstract protected function getCharInfo($id);
	//print all ticket ids as json string (used to check if a new ticket arrived)
	abstract protected function showIds();
	//add the given mail data to the database 
	abstract protected function sendMail($char_id, $gmName, $subject, $ticket_id, $mail_body);
	//deletes the ticket with the given ticket id
	abstract protected function deleteTicket($ticket_id);
	
	public function login($loginResp = false)
	{
		if(isset($_POST["username"]) && isset($_POST["password"]))
		{
			$username = mysql_escape_string($_POST["username"]);
			$password = mysql_escape_string($_POST["password"]);
			$this->checkLogin($username, $password);
			if($loginResp == true)
			{
				echo "true";
			}
		}
		else
		{
			echo "false<br>No data entered";
			die;
		}
	}
	
	protected function doquery($query, $database, $fetch = false)
	{
		global $dbsettings;
		$link = mysql_connect($dbsettings["server"], $dbsettings["user"], $dbsettings["pass"]) or die(mysql_error());
		mysql_select_db($database) or die(mysql_error());
		echo mysql_error();
		$sqlquery 	= mysql_query($query) or die(mysql_error());

		if($fetch)
			return mysql_fetch_array($sqlquery);
		else
			return $sqlquery;
	}
}