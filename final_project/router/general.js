const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let asyncBooks = new Promise((resolve) => {
        resolve(res.send(books));
    });
    asyncBooks.then(
        (data) => console.log(data)
    )
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let asyncIsbn = new Promise((resolve, reject) => {
        if(books[req.params.isbn]) {
            resolve(res.send(books[req.params.isbn]));
        } else {
            reject(res.status(403).json({message: "ISBN does not exist."}));
        }
    });
    asyncIsbn.then(
        (data) => console.log(data)
    ).catch((err) => console.log(err))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.replace(/-/g,' ');
    let asyncAuthor = new Promise((resolve, reject) => {
        let authorBooks = {};
        let size = 0;
        for (key in books) {
            if (books[key].author == author) {
                authorBooks[key] = books[key];
                size++;
            }
        }
        if(size > 0) {
            resolve(res.send(authorBooks));
        } else {
            reject(res.status(403).json({message: "Author does not exist."}));
        }
    });
    asyncAuthor.then(
        (data) => console.log(data)
    ).catch((err) => console.log(err))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.replace(/-/g,' ');
    let asyncAuthor = new Promise((resolve, reject) => {
        let titleBooks = {};
        let size = 0;
        for (key in books) {
            if (books[key].title == title) {
                titleBooks[key] = books[key];
                size++;
            }
        }
        if(size > 0) {
            resolve(res.send(titleBooks));
        } else {
            reject(res.status(403).json({message: "Title does not exist."}));
        }
    });
    asyncAuthor.then(
        (data) => console.log(data)
    ).catch((err) => console.log(err))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    if (books[req.params.isbn]){
        res.send(JSON.stringify(books[req.params.isbn].reviews));
    } else {
        res.status(403).json({message: "ISBN does not exist."});
    }
});

module.exports.general = public_users;
