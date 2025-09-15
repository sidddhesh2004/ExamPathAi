// 1. Import the express library
const express = require('express');

// 2. Create an instance of an express app
const app = express();

// 3. Define the port our server will run on
const PORT = 5001; // Using a port like 5001 for the backend

// 4. Define a basic route
// This tells the server what to do when someone visits the main URL
app.get('/api', (req, res) => {
  res.json({ message: "Hello from the backend! 👋" });
});

// 5. Start the server and listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});