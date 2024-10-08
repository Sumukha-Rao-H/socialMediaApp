const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session"); 
const http = require("http"); 
const socketIo = require("socket.io");
const Message = require('./models/Message');
const GroupChatMessage = require('./models/groupChatMessages');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect("mongodb://localhost:27017/credentials", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

require('./config/passport')(passport);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "My express application",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res) {
    res.render("login"); 
});


app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/upload'));
app.use('/', require('./routes/friends'));
app.use('/', require('./routes/chat'));
app.use('/', require('./routes/groups'));
app.use('/', require('./routes/feed'));

io.on('connection', (socket) => {

    socket.on('chat message', async (msg) => {
        try {
            // Check if the message content is not empty
            if (!msg.content || msg.content.trim() === '') {
                console.error('Error: Message content is empty.');
                return;
            }

            // Create a new message and save it to the database
            const message = new Message({
                sender: msg.sender,
                receiver: msg.receiver,
                content: msg.content
            });
            await message.save();

            // Emit the message to the other user
            io.emit('chat message', message);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });
    socket.on('joinGroup', async (groupId) => {
        
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            console.error('Invalid groupId:', groupId);
            return;
        }

        socket.join(groupId); 
        try {
            if (!mongoose.Types.ObjectId.isValid(groupId)) {
                throw new Error('Invalid ObjectId');
            }
            // Ensure groupId is converted to an ObjectId
            const groupIdObjectId = new mongoose.Types.ObjectId(groupId);
            
            // Fetch previous messages from the database
            const messages = await GroupChatMessage.find({ groupId: groupId }).sort({ createdAt: 1 }).exec();
            socket.emit('previousMessages', messages);
        } catch (error) {
            console.error('Error fetching messages on join:', error);
        }
    });

    socket.on('group chat', async (data) => {

        const newMessage = new GroupChatMessage({
            sender: data.sender,
            groupId: data.groupId,
            content: data.content,
        });

        try {
            await newMessage.save();
            io.to(data.groupId).emit('group chat', newMessage);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
    });
});


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server Has Started!");
});