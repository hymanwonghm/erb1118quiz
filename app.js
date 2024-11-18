const express = require("express");
const bodyParser = require("body-parser"); // Parse JSON request bodies
const session = require("express-session");
const apiKey = "your-secret-key"; // Hypothetical API key

const app = express();

let fruits = [
  { name: "Apple", price: 3 },
  { name: "Orange", price: 5 },
  { name: "Banana", price: 5 },
];

app.use(session({ secret: apiKey }));
app.use(bodyParser.json());

// Q1 TODO: complete the Logging middleware
app.use((req, res, next) => {
  // Add you code here
  req.time = new Date(Date.now()).toString();
  console.log({"request method: ": req.method, "status code: ": res.statusCode, "request body: ": req.body, "host: ": req.hostname, "path: ":req.path, "time: ": req.time});
  next();
});

app.get("/", (req, res) => {
  res.send("App Running");
});

// Q2 TODO: complete the greeting api, get `userName` from session and return a welcome message.
app.get("/greet", (req, res) => {
  // Add you code here
  const userName = req.session.user
  res.send(`Hello, ${userName}`)
});

// Q2 TODO: complete the login api, save the given name to session and return a welcome message.
app.get("/login/:name", function (req, res) {
  // Add you code here
  const userName = req.params.name
  req.session.user = userName
  res.send(`Welcome ${userName}`)
});

// Q3 TODO: complete the listFruits api
app.get("/listFruits", (req, res) => {
  // Add you code here
  try {
    if (fruits.length !== 0) {
      res.json(fruits)
    } else {
      console.log("Failed to fetch fruits as there is no fruit exists")
      res.status(404).json({error: "Failed to fetch fruits as there is no fruit exists"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Failed to fetch fruits"})
  }
});

/**
 * Q4 TODO: complete the searchFruit api, filters all the fruit items whose fruit name
 * includes the given search term and returns all the matching item(s).
 */
app.get("/searchFruit/:term", (req, res) => {
  // Add you code here
  try {
    const searchTerm = req.params.term
    const searchResult = fruits.filter(fruit => fruit.name.includes(searchTerm))
    if (searchResult.length !== 0) {
      res.json(searchResult)
    } else {
      console.log("Failed to search fruits as there is no fruit match the search term")
      res.status(404).json({error: "Failed to search fruits as there is no fruit match the search term"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Failed to search fruits"})
  }
});

/**
 * Q5 TODO: complete the addFruit api, creates a new fruit item and add it to fruits.
 * Return a json object with a status code 200 which includes a message of
 * “Add new fruit successfully.” and the new added fruit item.
 */
app.post("/addFruit", async (req, res) => {
  // Add you code here
  try {
    const userInput = req.body
    const fruitName = userInput.name
    const fruitPrice = Number(userInput.price)
    if ( fruitName !== undefined && !isNaN(fruitPrice)) {
      fruits.push({name: fruitName, price: fruitPrice})
      res.status(200).json({messgae: "Add new fruit successgully.", addedItem: fruits[fruits.length -1]})
    } else {
      console.log("Failed to add fruit as the user input is invalid.")
      res.status(404).json({error: "Failed to search fruits as as the user input is invalid."})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Failed to add fruit"})
  }
});

/**
 * Q6 TODO: complete the deleteFruit api, remove the fruit item from the
 * fruits array whose fruit name is matching with the given name parameter.
 * If no record is found with the given name, return a json object with a
 * status code 404 which includes an error message of “Fruit not found”.
 * If any fruit item is deleted, return a json object with a status code
 * 200 which includes a message of “Delete fruit successfully.” and the
 * new updated fruits array.
 */
app.delete("/deleteFruit/:name", (req, res) => {
  // Add you code here
  try {
    const matchingFruit = req.params.name
    const matchingResult = fruits.filter(fruit => fruit.name === matchingFruit)
    if (matchingResult.length !== 0) {
      const deletedResult = fruits.filter(fruit => fruit.name !== matchingFruit)
      fruits = deletedResult
      res.status(200).json({messgae: "Delete fruit successgully.", updatedFruitsArrary: fruits})
    } else {
      console.log("Fruit not found")
      res.status(404).json({error: "Fruit not found"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Failed to delete fruits"})
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
