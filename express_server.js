const express = require("express");
const morgan = require('morgan');
const app = express();
const PORT = 8080; // default port 8080


app.set('view engine', 'ejs');
app.use(morgan('dev'));

// use res.render to load up an ejs view file

// index page


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls/:id", (req, res) => {
  console.log('req:', req);
  console.log('req params:', req.params);
  const id = req.params.id
  const templateVars = { id: id, longURL: urlDatabase.id };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});