const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const app = express();

mongoose.connect("mongodb://localhost:27017/credentials", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

require('./config/passport')(passport);

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server Has Started!");
});