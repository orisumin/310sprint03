require("dotenv").config();

//importing modules
const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

//store an express application in app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve your existing HTML, CSS, JS, and images
app.use(express.static(__dirname));

const client = new MongoClient(process.env.MONGODB_URI);

async function startServer() {
    try {
        await client.connect();

        console.log("Connected to MongoDB Atlas!");

        const db = client.db("PokemonDB");
        const pokemons = db.collection("Pokemons");

        // API endpoint: retrieve all Pokemon
        app.get("/api/Pokemons", async (req, res) => {
            try {
                const result = await pokemons.find().toArray();

                res.json(result);
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    error: "Failed to retrieve Pokemon"
                });
            }
        });

        // Open your existing website
        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "search.html"));
        });

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Connection failed:", error);
        process.exitCode = 1;
        await client.close();
    }
}

startServer();