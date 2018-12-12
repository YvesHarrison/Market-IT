
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
