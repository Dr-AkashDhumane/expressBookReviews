const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
let books = require('./router/booksdb.js');

const app = express();
app.use(express.json());

// Session setup for /customer routes
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for protected routes
app.use("/customer/auth/*", (req, res, next) => {
    if (req.session.authorization && req.session.authorization.accessToken) {
        try {
            const token = req.session.authorization.accessToken;
            jwt.verify(token, "access");  // verify JWT
            next();
        } catch (err) {
            return res.status(401).json({ message: "User not authenticated" });
        }
    } else {
        return res.status(401).json({ message: "User not authenticated" });
    }
});

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Helper endpoints for Async/Await / Axios testing
app.get('/fetch/books', (req, res) => {
    res.json(books);
});

app.get('/fetch/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.json(books[isbn]);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
