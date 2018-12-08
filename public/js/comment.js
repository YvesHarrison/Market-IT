//client side
const myForm = document.getElementById("myForm");

if (myForm) {
    const textInput = document.getElementById("text_input");

    myForm.addEventListener("submit", event => {

        event.preventDefault();
        
        if (textInput.value) {
            //we hide the error div in case it's visible
            
            let input=textInput.value

            
            
            //const li = `<li class="not-palindrome"> ${textInput.value} </li>`
            //$("#attempts").append(li);
            let date="";
            var myDate = new Date();
            date=myDate.toLocaleString( );
            //const le = `<li class="not-palindrome"> ${date} </li>`
            const comment=`<tr><td>${input}</td><td>${input}</td><td>${date}</td></tr>`
            
            $("#comment-table").append(comment);
            $("#myForm").trigger('reset');
            $('#text_input').focus();
        } else {
            //If the user did not enter input, we show the error div and text
            $("#error").show();
            $("#error").html("Error nothing to comment!");
            $('#text_input').focus();
        }

    });
 }