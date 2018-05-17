<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
if(!isset($_POST)) die();

session_start();

$con = mysqli_connect('localhost', 'root', '', 'wp');
$response = [];
$username = mysqli_real_escape_string($con, $_POST['username']);
$password = mysqli_real_escape_string($con, $_POST['password']);
$email = mysqli_real_escape_string($con, $_POST['email']);

//$query = "UPDATE `users` SET `password` = '$newPass' WHERE `username` = '".$_SESSION['user']."'";
$query = "INSERT INTO users (ID, Username, Password, Email) VALUES (NULL,'$username','$password','$email')";
$result = mysqli_query($con, $query);

if($result){
	$response['status'] = 'done';
} else {
	$response['status'] = 'error';
}

echo json_encode($response);