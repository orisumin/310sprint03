# Pokemon Search Website

A Pokémon Violet base-form search website built with HTML, CSS, JavaScript, Node.js, Express, and MongoDB. The browser retrieves Pokémon records from an Express API and displays searchable, filterable cards. The backend supports creating, reading, updating, and deleting Pokémon documents in MongoDB.

## Instructions for Build and Use

Steps to build and/or run the software:

1. Node.js 20.19.0 or later and npm. The current development environment uses Node.js 24.22.1.
2. A MongoDB deployment, such as MongoDB Atlas, and a connection string.
3. Database credentials with permission to read and write the project's collection. For Atlas, configure network access for the machine running the server.

## Instructions for using the software:

1. Clone or download the project and open a terminal in the project root, where `package.json` is located.
2. Install dependencies: npm install
3. Create a `.env` file in the project root: MONGODB_URI="YOUR_MONGODB_CONNECTION_STRING"
Replace the placeholder with your own connection string. `PORT` is optional and defaults to `3000`. Keep `.env` out of Git; it is listed in `.gitignore`.
   PORT=3000
4. The server uses the database **`PokemonDB`** and collection **`Pokemons`**. Use those exact names when importing or preparing records. The project does not currently include an automatic seed/import script or a populated JSON dataset.

5. Start the server: npm start
6. Open [the website](http://localhost:3000/) in a browser. The API can also be viewed at [the Pokémon endpoint](http://localhost:3000/api/Pokemons). Use your configured port if it differs from `3000`.

## Development Environment

To recreate the development environment, you need the following software and/or libraries with the specified versions:

* Node.js
* Express
* MongoDB Node.js driver
* dotenv
* HTML, CSS, and JavaScript
* MongoDB Atlas

## Useful Websites to Learn More

I found these websites useful in developing this software:

* I used ai to learn about mongoDB queries, Node.js, Express, and MongoDB Node.js driver.

## Future Work

The following items I plan to fix, improve, and/or add to this project in the future:

* [ ] Add authentication, authorization, and deployment security settings before making the application publicly available.
* [ ] Add image fallbacks and further responsive layout checks.
* [ ] Add a reusable dataset and seed/import instructions.