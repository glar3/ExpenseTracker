const usernameInput = document.querySelector(".username");
const depositInput = document.querySelector(".deposit");
const createUserButton = document.querySelector(".createUser");
const createUserPrompt = document.querySelector(".createdUserPrompt");

createUserButton.addEventListener('click', (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const balance = parseFloat(depositInput.value);

    if (username && !isNaN(balance)) {
        fetch(`/createUser?username=${encodeURIComponent(username)}&balance=${encodeURIComponent(balance)}`)
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => Promise.reject(err));
                }
                return res.json();
            })
            .then(({ success, user }) => {
                if (success && user) {
                    createUserPrompt.classList.remove("error")
                    createUserPrompt.textContent = `${user.username}, you have successfully created an account with a balance of ${user.balance}!`;
                    createUserPrompt.style.display = "block";
                } else {
                    throw new Error("User creation failed");
                }
            })
            .catch(err => {
                console.error("Error occurred:", err);
                createUserPrompt.classList.add("error")
                createUserPrompt.textContent = `Error: ${err.error || 'Unable to create user. Please try again.'}`;
                createUserPrompt.style.display = "block";
            });
    } else {
        createUserPrompt.textContent = 'Please enter a valid username and deposit amount.';
        createUserPrompt.style.display = "block";
    }
});
