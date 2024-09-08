// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory store for user permissions (replace with a database in production)
let userPermissions = {};

// Save user permissions
app.post('/api/permissions', (req, res) => {
    const { userId, cameraPermission, audioPermission } = req.body;
    userPermissions[userId] = { cameraPermission, audioPermission };
    res.status(200).json({ message: 'Permissions updated' });
});

// Get all users with their permissions
app.get('/api/users', (req, res) => {
    res.status(200).json(Object.entries(userPermissions).map(([userId, permissions]) => ({
        userId,
        ...permissions
    })));
});

// Check camera access for a specific user
app.post('/api/check-camera', (req, res) => {
    const { userId } = req.body;
    if (userPermissions[userId]?.cameraPermission) {
        res.status(200).json({ message: 'User has camera access' });
    } else {
        res.status(403).json({ message: 'User does not have camera access' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
