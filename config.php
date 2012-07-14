<?php
/*
*	Remote Ticket Tracker - Server
*	Settings
*	Made by Thedeath
*/
$dbsettings = Array
(
	"server"     => "localhost", // MySQL server name.
	"user"       => "phost185604", // MySQL username.
	"pass"       => "1994schuleist", // MySQL password.
	"world_db"       => "phost185604", //MySQL database name for Wintergrasp characters
	"acc_db"       => "phost185604", //MySQL database name for Wintergrasp characters
	"serverType" => "Trinity"		// Mangos/Trinity (if you want to run this script with for example arcemu you have to implement the class.AbstrTicketTracker.php file and name it 'class.ArcEmu.php' and the class ArcEmuRemoteTicketTracker
);
?>