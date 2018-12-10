//client side
const myForm = document.getElementById("myForm");

if (myForm) {
    const textInput = document.getElementById("text_input");

    myForm.addEventListener("submit", event => {

        event.preventDefault();
        
        if (textInput.value) {
            //we hide the error div in case it's visible
            
            let input=textInput.value

            
            let date="";
            let myDate = new Date();
            date=myDate.toLocaleString( );

            let requestConfig = {
          		method: "POST",
          		url: "/products/comment",
          		contentType: "application/json",
          		data: JSON.stringify({
            		comment: input,
            		time: date
          		})
        	};
        	
        	$.ajax(requestConfig).then(function(responseMessage) {
        		alert(responseMessage.comment);
        		alert(responseMessage.time);
        		alert("Comment Success!");
          		const comment=`<tr><td>${input}</td><td>${responseMessage.comment}</td><td>${responseMessage.time}</td></tr>`
            	$("#comment-table").append(comment);
			});

            
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