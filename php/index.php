<?php



    session_start();
  $error = "";
  $missing = "";
  // Logging out the user
  if (array_key_exists('logout', $_GET) == '1') {
        header("location: index.php");
        session_unset();
        session_destroy();
        exit;
    } 
    
    if (isset( $_SESSION['id'])) {
    
    header("Location: results.php");
    
    } else if (array_key_exists('submit', $_POST))  {
    
    include("./connection.php");
   
    
    if(!$_POST['nom']) {
        $missing.= " Entrez votre nom <br>";
    } 
    
    
    if(!$_POST['pass']) {
        $missing.= "Mot de passe absent<br>";
    } 
    if($missing != "") {
        $error .= "Les espaces suivants doivent etre remplis: <br>" .$missing;
    }
    if($error != "") {
      
        $error = '<div class="alert alert-danger" role="alert"><p> Il y a des erreurs dans votre formulaire </p>' . $error . '</div>';
        
    } else {
        
    
    $query = "SELECT * FROM `resultat` WHERE nom = '".mysqli_real_escape_string($link, $_POST['nom'])."' AND numExam ='".mysqli_real_escape_string($link, $_POST['pass'])."' LIMIT 1";
     
    $result = mysqli_query($link, $query);
    $row =  mysqli_fetch_array($result);
    
    if (isset($row)) {
    $_SESSION['id']=$row['id'];
    header("Location: results.php");
    exit;
    } else {
        
        $error = '<div class="alert alert-danger" role="alert"><p>Email et/ou mot de passe non reconnu. Controllez svp</p></div>';
        
         }
        
    } 


    }
   



?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Resultat du Bac</title>
    <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="../css/index.css">
</head>
<body>

    <div class="content">
    <div class="logo">
    <img src="../images/menfop1.jpg"></div>
    <form method="POST">
  <div class="form-group">
     <input type="text" class="form-control" id="nom" name="nom" aria-describedby="emailHelp" placeholder="Votre nom">
 </div>
  <div class="form-group">
    <input type="password" class="form-control" id="exampleInputPassword1" name="pass" placeholder="Numéro d'inscription">
  </div>
  <button type="submit" name="submit" class="btn btn-primary">Connexion</button>
</form>
    <div id="error"> <?php echo $error;  ?></div>
    </div>



<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>    
</body>
</html>