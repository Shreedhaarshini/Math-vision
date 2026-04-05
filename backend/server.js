require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const Contact = require('./src/models/Contact');

const testRoutes = require('./src/routes/testRoutes');
const solveRoutes = require('./src/routes/solveRoutes');
const performanceRoutes = require('./src/routes/performanceRoutes');
const imageRoutes = require('./src/routes/imageRoutes');
const userRoutes = require('./src/routes/userRoutes');
const practiceRoutes = require('./src/routes/practiceRoutes');
const universalSolver = require('./src/routes/universalSolver');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', testRoutes);
app.use('/api', solveRoutes);
app.use('/api', performanceRoutes);
app.use('/api', imageRoutes);
app.use('/api', userRoutes);
app.use('/api', practiceRoutes);
app.use('/api', universalSolver);

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });
    
    await newContact.save();
    
    res.status(200).json({ 
      success: true, 
      message: "Message saved to database" 
    });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to save message" 
    });
  }
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.error("MongoDB error:", err);
  });