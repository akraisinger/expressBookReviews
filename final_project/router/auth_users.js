const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("Customer successfully logged in");
    } else {
        res.send(JSON.stringify(users));
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const review = req.query.review;
    const userExists = books[isbn].reviews[username];
    books[isbn].reviews[username] = review;
    if(userExists){
        return res.status(200).send("Customer successfully updated review");
    } else {
        return res.status(200).send(`Customer successfully created review for book with ISBN ${isbn}`);
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const userExists = books[isbn].reviews[username];
    if (userExists) {
        delete books[isbn].reviews[username];
        return res.status(200).send(`Customer successfully deleted review for book with ISBN ${isbn}`);
    }
    else {
        return res.status(403).json({message: "Customer review does not exist to be deleted"})
    }
    
});

module.exports.authenticated = regd_users;
module.exports.users = users;
