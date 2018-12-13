
function validationForm(){

    var firstname = document.getElementById('firstName').value;
    var lastname = document.getElementById('last').value;
    var  email = document.getElementById('email').value;
    var  phone = document.getElementById('phone').value;
    var  city = document.getElementById('city').value;
    var address1 = document.getElementById('address1').value;
    var password = document.getElementById('password').value;
    var  password2 = document.getElementById('password2').value;

    //check empty fields
    if(firstname == "" || lastname == "" || email == "" || phone == "" || city == "" || address1=="" ||  password == "" || password2 == ""  )
    {
        alert("Input field is empty");
        return;
    }


    //check size of password
    if(password.length < 6){
        alert("Password must be greater than 6 characters");
        return;
    }

     if (document.getElementById('password').value == document.getElementById('password2').value){
            document.getElementById('repasswordHelp').style.color = 'green';
            document.getElementById('repasswordHelp').innerHTML = 'matching';
          } else {
            document.getElementById('repasswordHelp').style.color = 'red';
            document.getElementById('repasswordHelp').innerHTML = 're-password not matched';
          }
    //correct username 
    var str = firstname.slice(0,1);
    if(firstname.slice(0,1) == "_"|| firstname.slice(0,1) == "@" || str.match(/[0,9]/g) != null);
    {
        alert("Invalid username");
        return;
    } 
    }
        
        const errContainer = document.getElementById("error");
        const errTextElement = errContainer.getElementsByClassName(
            "error"
          )[0];
         
    

            // validation Login page
            function validation(){
                var logname = document.getElementById('logname').value;
                var logpassword = document.getElementById('logpassword').value;
            
                //check empty fields
                if(logname == "" || logpassword == ""){
                    alert("Username and password should not be empty");
                    return;
              
                } 
            }
                // check username match 
                if ((document.getElementById('logname').value ==
                document.getElementById('email').value) || (document.getElementById('logpassword').value ==
                document.getElementById('password').value)){
                document.getElementById('match').style.color ='green';
                document.getElementById('match').innerHTML = 'matching';
          } else {
            document.getElementById('match').style.color = 'red';
            document.getElementById('match').innerHTML = 'not matching';
          }       

                   

