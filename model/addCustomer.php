<?php
include "connectdb.php";

$data = json_decode(file_get_contents("php://input"));

if(isset($data->email)&&isset($data->username)&&isset($data->password)&&isset($data->reenterpassword)){

$email = mysqli_real_escape_string($conn,$data->email);
$username = mysqli_real_escape_string($conn,$data->username);
$password = mysqli_real_escape_string($conn,$data->password);
$reenterpassword = mysqli_real_escape_string($conn,$data->reenterpassword);

if($password==$reenterpassword){

$query= "SELECT * FROM Customer WHERE CustomerName ='".$username."'";
$result = mysqli_query($conn, $query);

$row=mysqli_fetch_array($result);
if(!empty($row)){

echo "username already taken";
}

else{

	echo "success";
}
$hash =password_hash($password,PASSWORD_BCRYPT);
mysqli_query($conn,"INSERT INTO users(Username,Password,Email) VALUES ('".$username."','".$email."','".$hash."')");

}
}
?>
