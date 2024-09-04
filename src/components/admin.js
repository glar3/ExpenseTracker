fetch('http://192.168.1.235:3000/users')
    .then(response => {
        if (!response.ok) {
            throw new Error("uwu you got blasted")
        }
        return response.json()
    })
    .then((users) => {
        const dataDiv = document.getElementById("data");

        const header = document.createElement("div")
        header.className = "header"
        header.innerHTML = `
                <h2 class="id">id</h2>
                <h2 class="username">username</h2>
                <h2 class="balance">balance</h2>
            `
        dataDiv.appendChild(header)

        users.forEach(({ id, username, balance }) => {
            const div = document.createElement("div")
            div.className = "record"
            div.innerHTML = `
                <h3 class="id">${id}</h3>
                <p class="username">${username}</p>
                <p class="balance">${balance}</p>
            `

            dataDiv.appendChild(div)
        })

    })
    .catch(err => {
        console.log("There was an error with the fetch operation: ", err)
    })