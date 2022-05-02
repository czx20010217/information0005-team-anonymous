<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diabetes@Home</title>
</head>
<body>
    <div class="header">
        <p><a href="/doctor/">
        <img src="/media/logo.png" alt="LOGO">
        </a></p>
        <nav>
            <ul>
          {{!-- nav bar on the top right of page --}}
            <li><a href="#">New Patient</a></li>
            <li><a href="#">Comments</a></li>
            <li><a href="#">Log Out</a></li>
          </ul>
        </nav>
      </div>

      <div class="loginingreeting">
        <p>Diabetes@Home <br> Welcome Back</p>
      </div>

      <div class="login">
          <p>LOGIN</p>
          <form action="#" method="post">
              Email Address<input type="text" class="email address" placeholder="Enter your email address"> 
              Password<input type="password" class="password" placeholder="Enter your password">
             
              <a href="#"> Forget your possword?</a>
              <input type="button" class="loginbutton"value="LOGIN">
              <p>Click <a href="#">here</a> to create an new account</p>

          </form>

      </div>
    
</body>
</html>