// Import required modules
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for cross-origin requests

// Basic route
// test
app.get('/', (req, res) => {
    res.send('Welcome to the Blog API!');
    console.log("database");
    console.log(process.env.MONGODB_URL);
});

// Define Mongoose Schema & Model
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// POST route to create a new blog post
app.post('/posts', async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        // Create a new blog post and save to MongoDB
        const newPost = new Post({ title, content });
        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
