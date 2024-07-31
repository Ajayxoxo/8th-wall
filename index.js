require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Log the MongoDB URL for debugging
console.log('MongoDB URL:', process.env.MONGO_URL);

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongoose connected');
  })
  .catch((error) => {
    console.error('Connection failed:', error);
  });

// Define the schema and model
const logInSchema = new mongoose.Schema({
  no: {
    type: Number,
    required: false,
    default: 0
  }
});

const LogInCollection = mongoose.model('LogInCollection', logInSchema);

// Set up Express app
const app = express();

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle page visits and increment the counter
app.get('/visit', async (req, res) => {
  try {
    const doc = await LogInCollection.findOneAndUpdate({}, { $inc: { no: 1 } }, { new: true, upsert: true });
    res.json({ visitCount: doc.no });
  } catch (error) {
    res.status(500).send('Error incrementing visit count');
  }
});

// Route to get the current visit count
app.get('/count', async (req, res) => {
  try {
    const doc = await LogInCollection.findOne({});
    res.json({ visitCount: doc ? doc.no : 0 });
  } catch (error) {
    res.status(500).send('Error fetching visit count');
  }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
