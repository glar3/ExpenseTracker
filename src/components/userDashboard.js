document.addEventListener("DOMContentLoaded", () => {
    const userDashboardData = document.querySelector(".userDashboardData");
    const div = document.createElement("div");
    const usernameDisplay = document.querySelector(".usernameBefore");
    const { username, balance } = JSON.parse(localStorage.getItem("user"));

    document.title = username;

    div.className = "userContainer";

    usernameDisplay.innerHTML = `Logged in as, <h1 class="username">${username}</h1>`;

    div.innerHTML = `
        <h2 class="balance">Balance: <span class="balance">R ${balance}</span></h2>
    `;
    userDashboardData.appendChild(div);
});

const goToAddFunds = document.querySelector("#goToAddFunds");
const addFunds = document.querySelector("#addFunds");
const goBack = document.querySelector("#goBack");
const addFundsContainer = document.querySelector(".addFundsContainer");
const fundsInput = document.querySelector(".fundsInput");

const showAddFundsContainer = () => {
    addFundsContainer.style.display = "block";
    goToAddFunds.style.display = "none";
    fundsInput.value = "";
};

const hideAddFundsContainer = () => {
    addFundsContainer.style.display = "none";
    goToAddFunds.style.display = "block";
    fundsInput.value = "";
};

goToAddFunds.addEventListener("click", (e) => {
    e.preventDefault();
    showAddFundsContainer();
});

goBack.addEventListener("click", hideAddFundsContainer);

addFunds.addEventListener("click", (e) => {
    e.preventDefault();

    const { username } = JSON.parse(localStorage.getItem("user"));
    const funds = fundsInput.value.trim();
    const balanceDisplay = document.querySelector(".balance")

    if (username && funds) {
        fetch(`/updateBalance?username=${encodeURIComponent(username)}&funds=${encodeURIComponent(funds)}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Unable to update balance");
                }
                return res.json();
            })
            .then(({ found, user }) => {
                if (found) {
                    console.log('User updated: ', user);
                    localStorage.setItem('user', JSON.stringify(user));

                    balanceDisplay.innerHTML = `
                         <h2 class="balance">Balance: <span class="balance">R ${user.balance}</span></h2>
                    `;
                } else {
                    console.log("User not found");
                }
            })
            .catch(err => {
                console.error("Error occurred:", err);
            });
    } else {
        console.error('No funds value found or username is missing');
    }

    hideAddFundsContainer();
});
