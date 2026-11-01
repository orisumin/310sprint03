require("dotenv").config();

//importing modules
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

//store an express application in app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve your existing HTML, CSS, JS, and images
app.use(express.static(path.join(__dirname, "public")));

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

      app.post("/api/Pokemons", async(req, res) =>{
      try{
        const checked = validatePokemon(req.body);

          if (checked.error) {
              return res.status(400).json({
                  error: checked.error
              });
          }

          const newPokemon = checked.value;
        
        if (
          typeof newPokemon?.name !== "string" || 
          !newPokemon.name.trim() ||
          !Array.isArray(newPokemon.type)
        ){
          return res.status(400).json({
            error:"A name and type array are required."
          });
        }

        const result = await pokemons.insertOne(newPokemon);

        res.status(201).json({
          message:"Pokemon added successfully!",
          id: result.insertedId
        });

      }catch(error){
        if (error.code === 11000) {
          return res.status(409).json({
            error: "That Pokédex number already exists. Choose a different number."
          });
        }
        console.error(error);
        res.status(500).json({
          error:"Failed to add Pokemon"
        });
      }
      });

      app.patch("/api/Pokemons/:id", async (req,res)=>{
        try{
          const id = req.params.id;
          const changes = req.body;

          const databaseId = parsePokemonId(id);
          if (databaseId === null){
            return res.status(400).json({
              error:"Invalid pokemon id"
            });
          }

          const checked = validatePokemon(changes, true);

          if (checked.error) {
              return res.status(400).json({
                  error: checked.error
              });
          }

          const updates = checked.value;

          if (Object.keys(updates).length ===0){
            return res.status(400).json({
              error:"No valid fields to update"
            });
          }

          //update the databse, saves the update result 
          const result = await pokemons.updateOne(
            {_id: databaseId},
            {$set:updates}
          );
          if (result.matchedCount ===0){
            return res.status(404).json({
              error:"Pokemon not found"
            });          
          }
          res.json({
            message:"Pokemon updated successfully!",
            modifiedCount: result.modifiedCount
          });

        }catch(error){
          console.error(error);
          res.status(500).json({
            error:"Failed to update pokemon"
          });
        }
      });

      app.delete("/api/Pokemons/:id", async (req, res) =>{
        try{
          const id = req.params.id;

          const databaseId = parsePokemonId(id);
          if (databaseId === null){
            return res.status(400).json({
              error:"invalid Pokemon ID"
            });
          }

          const result = await pokemons.deleteOne({
            _id: databaseId
          });

          if (result.deletedCount === 0){
            return res.status(404).json({
              error:"Pokemon not found"
            });
          }

          res.json({
              message: "Pokemon deleted successfully!",
              deletedCount: result.deletedCount
          });

        }catch(error){
          console.error(error);
          res.status(500).json({
            error:"Failed to delete Pokemon"
          });
        }
      });

        // Open your existing website
        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "public","search.html"));
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
const validTypes = [
    "bug", "dark", "dragon", "electric", "fairy", "fight",
    "fire", "flying", "ghost", "grass", "ground", "ice",
    "normal", "poison", "psychic", "rock", "steel", "water"
];

function validatePokemon(data, partial = false) {
    // The request must contain an object, not null or an array.
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return { error: "Send a JSON object." };
    }

    // Each function returns true when its field is valid.
    const rules = {
        _id: value => Number.isSafeInteger(value) && value > 0,
        name: value =>
            typeof value === "string" &&
            value.length <= 80 &&
            /^[A-Za-z0-9_-]+$/.test(value) &&
            !/[\r\n]/.test(value),

        type: value =>
            Array.isArray(value) &&
            value.length >= 1 &&
            value.length <= 2 &&
            value.every(type => validTypes.includes(type)),

        category: value =>
            typeof value === "string" &&
            value.trim().length > 0 &&
            value.length <= 120,

        height: value => Number.isFinite(value) && value > 0,

        weight: value => Number.isFinite(value) && value > 0,

        ability: value =>
            Array.isArray(value) &&
            value.length >= 1 &&
            value.length <= 10 &&
            value.every(ability =>
                typeof ability === "string" &&
                ability.trim().length > 0 &&
                ability.length <= 100
            ),

        img: value =>
            typeof value === "string" &&
            /^img\/[A-Za-z0-9_-]+\.webp$/.test(value) &&
            !/[\r\n]/.test(value)
    };

    const fields = Object.keys(data);

    if (fields.length === 0) {
        return { error: "Send at least one field." };
    }

    // Reject unknown fields and invalid values.
    for (const field of fields) {
        if (partial && field === "_id") {
            return { error: "The Pokédex number cannot be changed." };
        }
        if (!Object.hasOwn(rules, field)) {
            return { error: "Unknown field: " + field };
        }

        if (!rules[field](data[field])) {
            return { error: "Invalid value for " + field };
        }
    }

    const requiredFields = [
        "_id", "name", "type", "category", "height", "weight", "ability"
    ];

    // POST requires all these fields; PATCH permits partial updates.
    if (!partial) {
        for (const field of requiredFields) {
            if (!Object.hasOwn(data, field)) {
                return { error: "Missing field: " + field };
            }
        }
    }

    // Copy only the fields that passed validation.
    const value = {};

    for (const field of fields) {
        value[field] = data[field];
    }

    return { value };
}
// New records use numeric Pokédex IDs. Existing ObjectId records still work.
function parsePokemonId(id) {
    if (/^[1-9][0-9]*$/.test(id)) {
        const number = Number(id);
        if (Number.isSafeInteger(number)) {
            return number;
        }
    }
    if (ObjectId.isValid(id)) {
        return new ObjectId(id);
    }
    return null;
}

startServer();