import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

const db = new Database("./databases/users.db");

db.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, balance REAL)').run();

app.use('/components', express.static(path.join(__dirname, "src/components")));
app.use(express.static(path.join(__dirname, "src")));

app.get("/users", (req, res) => {
    res.json(getUsers());
});

app.get("/userInfo", (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        const user = getSingleUser({ username });

        if (!user) {
            return res.json({ found: false });
        }

        res.json({ found: true, user });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/updateBalance", (req, res) => {
    const username = req.query.username;
    const funds = parseFloat(req.query.funds);

    if (!username || isNaN(funds)) {
        return res.status(400).json({ error: "Username and valid funds are required" });
    }

    try {
        const user = getSingleUser({ username });

        if (!user) {
            return res.json({ found: false });
        }

        const newBalance = user.balance + funds;
        db.prepare('UPDATE users SET balance = ? WHERE username = ?').run(newBalance, username);

        const updatedUser = getSingleUser({ username });
        res.json({ found: true, user: updatedUser });
    } catch (err) {
        console.error("Error updating user balance:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/createUser", (req, res) => {
    const username = req.query.username;
    const balance = parseFloat(req.query.balance);

    if (!username || isNaN(balance)) {
        return res.status(400).json({ error: "Username and valid balance are required" });
    }

    try {
        // Check if user already exists
        const existingUser = getSingleUser({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Create new user
        createUser({ username, balance });

        // Fetch and return the newly created user
        const newUser = getSingleUser({ username });
        res.json({ success: true, user: newUser });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// SQL Functions
const getUsers = () => {
    return db.prepare('SELECT * FROM users').all();
};

const getSingleUser = ({ username }) => {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
};

const createUser = ({ username, balance }) => {
    try {
        db.prepare('INSERT INTO users (username, balance) VALUES (?, ?)').run(username, balance);
    } catch (err) {
        console.error("Error inserting user into database:", err);
        throw err;
    }
};


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
