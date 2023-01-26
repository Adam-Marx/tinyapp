const express = require("express");
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080

//MIDDLEWARE
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))




//DATABASES

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "one@mail.com",
    password: "pw",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "two@mail2.com",
    password: "pw2",
  },
};

const userLookUp = (email) => {
  foundUser = null;
  for (const user in users) {
    const userID = users[user]
    if(userID.email === email) {
      return foundUser = userID;
    } 
  }
};

const generateRandomString = (length) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
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

//REGISTER
app.get('/register', (req, res) => {
  res.render('register');
})

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const randomID = generateRandomString(4);
  const newUser = {
    id: randomID,
    email: email,
    password: password
  };

  if (email === '' || password === '') {
    return res.status(400).send('Please enter a valid email and password.');
  }

  if(userLookUp(email)) {
    return res.status(400).send('That email is already in use. Please choose a different one.')
  }

  users[randomID] = newUser;
  res.cookie('user_id', randomID);
  res.redirect('/urls');
});

//LOGIN

app.post('/login', (req, res) => {
  const nameInput = req.body.user_id;
  res.cookie('username', nameInput);
  res.redirect('/urls');
});

//LOGOUT

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
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
  const user = req.cookies.user_id
  const newUser = users[user];
  const templateVars = {
    user_id: newUser,
    urls: urlDatabase
  };
  console.log(newUser);
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
  const user = req.cookies.user_id
  const newUser = users[user];
  const templateVars = {
    user_id: newUser
  };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(6);
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
  const user = req.cookies.user_id
  const newUser = users[user];
  const shortURL = req.params.shortURL
  const templateVars = {
    user_id: newUser,
    shortURL: shortURL,
    longURL: urlDatabase[shortURL],
  };
  res.render("urls_show", templateVars);
});

//LISTEN
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
