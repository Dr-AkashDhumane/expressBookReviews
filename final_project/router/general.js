const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register route for general users
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Async/Await version to get all books
public_users.get('/', async (req, res) => {
    try {
        // Simulate an Axios GET request to fetch all books
        const response = await axios.get('http://localhost:5000/fetch/books'); 
        return res.status(200).json(response.data);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Async/Await version to get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/fetch/books/${isbn}`);
        return res.status(200).json(response.data);
    } catch (err) {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Async/Await version to get books by author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        const response = await axios.get('http://localhost:5000/fetch/books'); // fetch all first
        const filtered = {};
        Object.keys(response.data).forEach(isbn => {
            if (response.data[isbn].author.toLowerCase() === author) {
                filtered[isbn] = response.data[isbn];
            }
        });
        return res.status(200).json(filtered);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Async/Await version to get books by title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const response = await axios.get('http://localhost:5000/fetch/books'); // fetch all first
        const filtered = {};
        Object.keys(response.data).forEach(isbn => {
            if (response.data[isbn].title.toLowerCase() === title) {
                filtered[isbn] = response.data[isbn];
            }
        });
        return res.status(200).json(filtered);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports.general = public_users;
