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
		$dataSet = isset($_POST["username"]) && isset($_POST["password"]);
		if($dataSet == true && $loginResp == true)
		{
			$username = mysql_escape_string($_POST["username"]);
			$password = mysql_escape_string($_POST["password"]);
			$this->checkLogin($username, $password);
			session_start();
			$_SESSION['username'] = $username;
			$_SESSION['password'] = $password;
			if($loginResp == true)
			{
				echo "true";
			}
		}
		else if($loginResp == false)
		{
			$username = $_SESSION['username'];
			$password = $_SESSION['password'];
			if(isset($username) && isset($password))
			{
				$this->checkLogin($username, $password);
			}
		}
		else
		{
			echo "false<br>No data entered";
			die;
		}
	}
	
	public function logout()
	{
		$_SESSION = array();
		if (ini_get("session.use_cookies")) 
		{
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
		}
		session_destroy();
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