const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const patientsRouter = require('./routes/patients'); // Ensure this path is correct
const doctorsRouter = require('./routes/doctors');  // Ensure this path is correct
const appointmentsRouter = require('./routes/appointments');

// Property Schema Definition
const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  contact: String,
  reviews: [
    {
      user: String,
      rating: Number,
      comment: String,
    },
  ],
});

// Create the Property model
const Property = mongoose.model("Property", propertySchema);

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middleware
app.use(bodyParser.json()); // For parsing application/json
app.use(express.json()); // This handles JSON parsing

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hospital', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.use('/patients', patientsRouter);
app.use('/doctors', doctorsRouter);
app.use('/appointments', appointmentsRouter);

app.post("/api/properties", async (req, res) => {
  try {
    const { title, description, image, contact } = req.body;

    if (!title || !description || !image || !contact) {
      return res.status(400).json({ message: "Incomplete property data" });
    }

    const newProperty = new Property({ title, description, image, contact, reviews: [] });
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Root route to check if server is running
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
