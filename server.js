require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
/* Requiring express sessions to handle users logged in */
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 3000;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();

// Adding our Middleware to render res.body to the app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Adding the path of files for static routes
app.use(express.static("public"));

// Setting up the Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
    })
);
app.set("view engine", "handlebars");

// We need to use sessions to keep track of our user's login status
app.use(
    session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Requiring our Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Syncing our database
var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
    syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
    app.listen(PORT, function() {
        console.log(
            "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
            PORT,
            PORT
        );
    });
});

module.exports = app;