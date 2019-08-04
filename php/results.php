<?php

session_start();
// Check if user is logged in
if (!isset( $_SESSION['id'])) {
header("Location: index.php");
exit;
}else {
    include("./connection.php");
    $elev = $_SESSION['id'];
    $query = "SELECT * FROM `resultat` WHERE id = $elev ";
     
    $result = mysqli_query($link, $query);
    $row =  mysqli_fetch_array($result);
    
    if (isset($row)) {
    $nom= $row['nom'];
    $numE= $row['numExam'];
    $daNai= $row['dateNaissance'];
    $etab= $row['etablissement'];
    $liste= $row['liste'];
    $mention=$row['mention'];
    } 
}

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Resultats</title>
    <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="../css/result.css">
</head>
<body>
    <div class="box">
    <div class="logo">
    <img src="../images/menfop1.jpg"></div>
    <table >
   <tr>
                <th>Nom</th>
                <td><?php echo $nom; ?></td>
            </tr>
            <tr>
                <th>Numéro d'inscription</th>
                <td><?php echo $numE; ?></td>
            </tr>
            <tr>
                <th>Date de naissance</th>
                <td><?php echo $daNai; ?></td>
            </tr>
            <tr>
                <th>Établissement</th>
                <td><?php echo $etab; ?></td>
            </tr>
            <tr>
                <th>Liste</th>
                <td><?php echo $liste; ?></td>
            </tr>
            <tr>
                <th>Mention</th>
                <td><?php echo $mention; ?></td>
            </tr>
  
</table>

    <div class="logout">
    <a class='dropdown-item' href='index.php?logout=1'>Déconnexion</a>
    </div>
    </div>
   
</body>
</html>