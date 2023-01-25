const express = require("express");
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())
const PORT = 8080; // default port 8080


app.set('view engine', 'ejs');
app.use(morgan('dev'));



// INDEX PAGE

function  generateRandomString() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 6; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//BASIC HELLO WORLD
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//LOGIN

app.post('/login', (req, res) => {
  const nameInput = req.body.username;
  res.cookie('username', nameInput);
  res.redirect('/urls');
});

//LOGOUT

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

//EDIT URLS
  app.post('/urls/:shortURL', (req, res) => {
    const shortURL = req.params.shortURL;
    const newLongURL = req.body.longURL;
    urlDatabase[shortURL] = newLongURL;
    res.redirect('/urls');
  });


//URLS INDEX/TABLE PAGE
app.get('/urls', (req, res) => {
  const templateVars = { username: req.cookies["username"], urls: urlDatabase };
  res.render('urls_index', templateVars);
});

//DELETE URLS
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL
  delete urlDatabase[shortURL];
  res.redirect('/urls')
});

//NEW URLS
app.get("/urls/new", (req, res) => {
  const templateVars = { 
                        username: req.cookies["username"], 
                      };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL; 
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});


//SHORT URL LINK TO ORIGINAL LONGURL WEBSITE
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

//SHORT URL LINK
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const templateVars = { 
                        username: req.cookies["username"], 
                        shortURL: shortURL, 
                        longURL: urlDatabase[shortURL] 
                      };
  res.render("urls_show", templateVars);
});

//LISTEN
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
