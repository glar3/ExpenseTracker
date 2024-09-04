const usernameInput = document.querySelector(".usernameInput")
const formContainer = document.querySelector(".formContainer")

formContainer.addEventListener("submit", (e) => {
    e.preventDefault()

    const username = usernameInput.value.trim()
    if (username) {
        fetch(`/userInfo?username=${encodeURIComponent(username)}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Unable to fetch")
                }
                return res.json()
            })
            .then(({ found, user }) => {
                if (found) {
                    console.log('User found: ', user)

                    localStorage.setItem('user', JSON.stringify(user))

                    window.location.href = "./userDashboard.html"
                } else {
                    console.log("User not found")
                }
            })
            .catch(err => {
                console.log("Error occured:", err)
            })
    } else {
        console.log('Username input is empty')
    }
})