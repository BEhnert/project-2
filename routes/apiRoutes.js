// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {

    /***************  INVENTORY API ROUTES ***************/
    // Get all inventory
    app.get("/api/inventory", function(req, res) {
        db.inventory.findAll({}).then(function(dbGetInventory) {
            res.json(dbGetInventory);
        });
    });

    // Get all inventory within an specific id filter
    app.get("/api/inventory/:id", function(req, res) {
        db.inventory.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(dbGetInventory) {
            res.json(dbGetInventory);
        });
    });

    // Create a new inventory
    app.post("/api/inventory", function(req, res) {
        db.inventory.create(req.body).then(function(dbInventory) {
            res.json(dbInventory);
        });
    });

    //Update item from inventory request
    app.put("/api/inventory/:id", function(req, res) {
        db.inventory
            .update({
                categoryName: req.body.categoryName,
                itemName: req.body.itemName,
                quantity: req.body.quantity,
                replenishFlag: req.body.replenishFlag,
                price: req.body.price,
                supplierName: req.body.supplierName,
            }, {
                where: {
                    id: req.params.id,
                },
            })
            .then(function(dbInventory) {
                res.json(dbInventory);
            });
    });

    // Find items running low on inventory
    // Add where clause to compare the quantity field with the Replenish flag
    app.get("/api/inventory/low", function(req, res) {
        db.inventory
            .findAll({
                where: {
                    quantity: req.body.quantity <= req.body.replenishFlag,
                },
            })
            .then(function(dbGetInventoryLow) {
                res.json(dbGetInventoryLow);
            });
    });

    /***************  LISTDETAILS API ROUTES ***************/
    // Get all Listdetails
    app.get("/api/listdetails", function(req, res) {
        db.listdetails.findAll({}).then(function(dbGetlistdetails) {
            res.json(dbGetlistdetails);
        });
    });

    // Get all Listdetails where idlist match req.params.id
    app.get("/api/listdetails/:shoppinglistId", function(req, res) {
        db.listdetails.findAll({
            include: [{
                model: db.inventory
            }],
            where: {
                shoppinglistId: req.params.shoppinglistId
            }
        }).then(function(resultDetails) {
            res.json(resultDetails);
        });
    });

    // Create/Post a new Listdetails
    app.post("/api/listdetails", function(req, res) {
        db.listdetails.create(req.body).then(function(dbListdetails) {
            res.json(dbListdetails);
        });
    });

    //Update item from Listdetails request
    app.put("/api/listdetails/:idItem", function(req, res) {
        console.log(req.params);
        db.listdetails
            .update({
                quantityObtained: req.body.quantityObtained,
                status: req.body.status,
            }, {
                where: {
                    inventoryId: req.params.idItem,
                },
            })
            .then(function(dbListdetails) {
                res.json(dbListdetails);
            });
    });

    /***************  SHOPPINGLIST API ROUTES ***************/
    // Get all shoppinglist
    app.get("/api/shoppinglist", function(req, res) {
        db.shoppinglist.findAll({}).then(function(dbGetshoppinglist) {
            res.json(dbGetshoppinglist);
        });
    });

    // Get shopping List by id
    app.get("/api/shoppinglist/:id", function(req, res) {
        db.shoppinglist.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(result) {
            res.json(result);
        });
    });

    // Get shopping List by User id
    app.get("/api/shoppinglist/:userid", function(req, res) {
        db.shoppinglist.findOne({
            where: {
                idUser: req.params.userid
            }
        }).then(function(result) {
            res.json(result);
        });
    });

    // Create/Post a new shoppinglist
    app.post("/api/shoppinglist", function(req, res) {
        db.shoppinglist.create(req.body).then(function(dbshoppinglist) {
            res.json(dbshoppinglist);
        });
    });


    //Update shoppinglist from user request
    app.put("/api/shoppinglist/user/:id", function(req, res) {
        db.shoppinglist
            .update({
                userId: req.body.userId,
                listName: req.body.listName,
                completeTask: req.body.completeTask,
            }, {
                where: {
                    userId: req.params.id,
                },
            })
            .then(function(dbshoppinglist) {
                res.json(dbshoppinglist);
            });
    });

    //Update shoppinglist from shoppinglistId
    app.put("/api/shoppinglist/id/:shoppinglistId", function(req, res) {
        db.shoppinglist
            .update({
                completeTask: req.body.completeTask,
            }, {
                where: {
                    id: req.params.shoppinglistId,
                },
            })
            .then(function(dbshoppinglist) {
                res.json(dbshoppinglist);
            });
    });

    /***************  AUTHTENTICATION API ROUTES ***************/
    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, update the status to true/logged send them to the protected route.
    // Otherwise the user will be sent an error
    app.post("/api/login", passport.authenticate("local"), function(req, res) {
        res.json(req.user);
    });

    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post("/api/signup", function(req, res) {
        db.user
            .create({
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                admin: false,
                status: false,
            })
            .then(function() {
                res.redirect(307, "/api/login");
                //res.render("login");
            })
            .catch(function(err) {
                res.status(401).json(err);
            });
    });

    //Route to sign up a user with admin previleges. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post("/api/signup/admin", function(req, res) {
        db.user
            .create({
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                admin: true,
                status: false,
            })
            .then(function() {
                console.log(`admin user created`);
                res.redirect(307, "/api/login");
                //res.render("login");
            })
            .catch(function(err) {
                res.status(401).json(err);
            });
    });

    // Route for logging user out
    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/login");
    });

    // Route for getting some data about our user to be used client side
    app.get("/api/user_data", function(req, res) {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        } else {
            // Otherwise send back the user's object stored in express session
            // Sending back a password, even a hashed password, isn't a good idea
            res.json({
                userId: req.user.id,
                userName: req.user.userName,
                userEmail: req.user.email,
                isUserAdmin: req.user.admin,
                status: req.user.status,
            });
        }
    });

    /***************  USERS MODEL API ROUTES ***************/
    // Get all users
    app.get("/api/users", function(req, res) {
        db.user.findAll({}).then(function(dbGetUser) {
            res.json(dbGetUser);
        });
    });



};