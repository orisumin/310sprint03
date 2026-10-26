const express = require("express");

const app = express();
const PORT = 3000;

app.get("/api/recipes",(req, res) => {
    const recipes = [
        {name: "Pasta", calories: 600},
        {name: "Salad", calories: 350},
        {name: "Soup", calories: 250}
    ];
    res.json(recipes);
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost${PORT}`);
});

