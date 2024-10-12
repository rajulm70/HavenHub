require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");
const Login = require("./models/login.js");

const app = express();

// Mongoose connection with options and extended timeout
async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 30000, // Increase connection timeout to 30 seconds
        });
        console.log("MongoDB connection successful");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
    }
}

// Call main function to establish the MongoDB connection
main();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.listen(process.env.PORT || 8080, () => {
    console.log(`Port is Listening on ${process.env.PORT || 8080}`);
});

// Routes and handlers
app.get("/home", (req, res) => {
    res.render("listing/home.ejs");
});

app.get("/", wrapAsync(async (req, res) => {
    res.render("listing/home.ejs");
}));

app.get("/home/login", wrapAsync(async (req, res) => {
    res.render("listing/login.ejs");
}));

app.post("/home/validate", wrapAsync(async (req, res, next) => {
    const { As, email, password } = req.body;
    try {
        const user = await Login.findOne({ email: email });

        if (user && user.password === password) {
            if (As === "Admin") {
                return res.redirect("/listings");
            } else {
                return res.send("Logged in as User");
            }
        } else {
            return res.render("listing/login.ejs", { error: "User not valid" });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
}));

app.get("/home/signup", wrapAsync(async (req, res) => {
    res.render("listing/signup.ejs");
}));

app.post("/home/new", wrapAsync(async (req, res, next) => {
    const newListing = new Login(req.body.login);
    await newListing.save();
    res.redirect("/home/login");
}));

app.get("/listings", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
}));

app.get("/listings/new", (req, res) => {
    res.render("listing/new.ejs");
});

app.post("/listings", wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", { listing });
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
}));

app.put("/listings/:id", wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Please Enter Valid Data");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
}));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});
