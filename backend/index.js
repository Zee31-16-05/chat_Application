// Import necessary modules
const express = require('express');
const app = express();
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const databaseConnect = require('./config/database');
const messengerRoute = require('./routes/messengerRoute');

dotenv.config(); // Load environment variables from a .env file

// Create an HTTP server instance
const expressServer = http.createServer(app);

// Set up Socket.IO server
const { Server } = require('socket.io');
const io = new Server(expressServer);

// Import required modules for routing and middleware
const path = require('path');
const authRouter = require('./routes/authRoute');

// Middlewares
app.use(cookieParser());
app.use(cors({ credentials: true, origin: '*' }));
app.use(bodyParser.json());

// Serve static files
// app.use(express.static('../frontend/chat-client/build'));

// Routes
app.use('/api/messenger', authRouter); // Handles user authentication and authorization
app.use('/api/messenger', messengerRoute); // Handles message sending and retrieval

// // Serve HTML file when there is no specific route request
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../', 'frontend', 'chat-client', 'build', 'index.html'));
// });

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    
    // Here you can add your chat logic
});

// Start the server on port 5000
databaseConnect();
expressServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});
