<?php
/*
*    Remote Ticket Tracker - Server
*    Settings
*    Made by Thedeath
*/
$dbsettings = Array
(
    "server"     => "localhost",    // MySQL server name.
    "user"       => "username",        // MySQL username.
    "pass"       => "password",     // MySQL password.
    "world_db"   => "chardb",         // MySQL database name for characters
    "acc_db"     => "accdb",         // MySQL database name for accounts
    "serverType" => "Mangos"        // Mangos/Trinity (if you want to run this script with for example arcemu you have to implement the class.AbstrTicketTracker.php file and name it 'class.ArcEmu.php' and the class ArcEmuRemoteTicketTracker
);
?>