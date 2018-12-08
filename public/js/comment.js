<<<<<<< HEAD

const inputPhrase = document.getElementById('check');
const button = document.querySelector('.submit-button');
const form = document.querySelector('#myform');

const checkInput = () => {
    if (inputPhrase.value.trim() !== "") {
        button.style.backgroundColor = '#c5464a';
    } else {
        button.style.backgroundColor = '#979695';
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    try {
        errorContainer.classList.add("hidden");

        if (inputPhrase.value.trim() == "") {
            alert("You should enter a phrase!");
            return;
        }
        if (palindrome(inputPhrase.value)) {
            let li = document.createElement('li');
            li.className = 'is-palindrome';
            li.innerText = inputPhrase.value;
            document.getElementById('attempts').appendChild(li);
        } else if (!palindrome(inputPhrase.value)) {
            let li = document.createElement('li');
            li.className = 'not-palindrome';
            li.innerText = inputPhrase.value;
            document.getElementById('attempts').appendChild(li);
        }
    } catch (error) {
        const message = typeof e === "string" ? e : e.message;
        errorTextElement.textContent = e;
        errorContainer.classList.remove("hidden");
    }

})
=======
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
>>>>>>> f6bb826a7f3d06d8575b73a28aa4e74e305a38d0
