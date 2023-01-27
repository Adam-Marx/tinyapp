//MODULES
const express = require("express");
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 8080; // default port 8080

//MIDDLEWARE
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['hgropiumvheoihm984c3q0ymteagnf', 'yu632n9-8vmhuxscgckpmeodgcjhpoieslhx-8']
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

//HELPERS
const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');


//DATABASES
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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

//HELLO
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//HELLO WORLD
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//REGISTER
app.get('/register', (req, res) => {
  const user = req.session.user_id
  const userID = users[user];
  const templateVars = {
    user_id: userID,
    urls: urlDatabase
  };

  if (userID) {
    res.redirect('/urls')
  }

  res.render('register', templateVars);
})

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const randomID = generateRandomString(4);
  const user = getUserByEmailUp(email, users);
  const hashedPassword = bcrypt.hashSync(password, 10);

  const userID = {
    id: randomID,
    email: email,
    password: hashedPassword
  };


  if (email === '' || password === '') {
    return res.status(400).send('Please enter a valid email and password.');
  }


  if (user) {
    return res.status(400).send('That email is already in use. Please choose a different one.')
  }



  users[randomID] = userID;
  res.redirect('/login');
});

//LOGIN

app.get('/login', (req, res) => {
  const user = req.session.user_id
  const userID = users[user];
  const templateVars = {
    user_id: userID,
    urls: urlDatabase
  };

  if (userID) {
    res.redirect('/urls')
  }

  res.render('login', templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmailUp(email, users);
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (email === '' || password === '') {
    return res.status(400).send('Please enter a valid email and password.');
  }

  if (!user) {
    return res.status(403).send('An account corresponding to that email address could not be found.');
  }



  if (user) {
    if (!bcrypt.compareSync(password, hashedPassword)) {
      return res.status(403).send('The password provided does not match.')
    } else if (bcrypt.compareSync(password, hashedPassword)) {
      req.session.user_id = user.id
      res.redirect('/urls');
    }
  }


});

//LOGOUT

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});



//DELETE URLS
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  const user = req.session.user_id
  const userID = users[user]
  const userURLs = urlsForUser(user, urlDatabase);
  console.log(userURLs);
  console.log(shortURL);

  if (!userID) {
    res.send("Error: You must be logged in to edit URLs.");
    return;
  }

  if (!userURLs[shortURL]) {
    return res.send('You do not have access to this URL.');
  }


  delete urlDatabase[shortURL];
  res.redirect('/urls')
});

//NEW URLS
app.get("/urls/new", (req, res) => {
  const user = req.session.user_id
  const userID = users[user];
  const templateVars = {
    user_id: userID,
    urls: urlDatabase
  };

  if (!userID) {
    res.redirect("/login");
    return;
  }
  res.render('urls_new', templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(6);
  const userID = req.session.user_id


  if (!userID) {
    res.send("<html><body><h1>Error</h1><p>You must be logged in to shorten URLs.</p></body></html>");
    return;
  }
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);
});


//SHORT URL LINK TO ORIGINAL LONGURL WEBSITE
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//SHORT URL LINK
app.get("/urls/:shortURL", (req, res) => {
  const user = req.session.user_id
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL].longURL
  const userURLs = urlsForUser(user, urlDatabase);

  if (!urlDatabase[shortURL]) {
    return res.send("<html><body><h1>Error</h1><p>Error, not a valid shortened URL/id.</p></body></html>");
  }

  if (!user) {
    return res.send("<html><body><h1>Error</h1><p>Error, you must be logged in to access this page.</p></body></html>");
  }

  console.log(userURLs);
  console.log(shortURL);
  if (!userURLs[shortURL]) {
    return res.send('You do not have access to this URL.');
  }

  const templateVars = {
    user_id: user,
    shortURL: shortURL,
    urls: urlDatabase,
    longURL: longURL
  };
  res.render("urls_show", templateVars);
});

//EDIT URLS
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const newLongURL = req.body.longURL;
  const user = req.session.user_id
  const userURLs = urlsForUser(user, urlDatabase);



  if (!user) {
    res.send("Error: You must be logged in to edit URLs.");
    return;
  }


  if (!userURLs[shortURL]) {
    res.send("Error: You do not have access to edit this URL.");
    return;
  }


  urlDatabase[shortURL].longURL = newLongURL;
  res.redirect('/urls');
});


//URLS INDEX/TABLE PAGE
app.get('/urls', (req, res) => {
  const user = req.session.user_id
  const userID = users[user];
  const templateVars = {
    user_id: userID,
    urls: urlDatabase
  };

  if (!userID) {
    return res.send('Login to view your URLs.');

  }
  res.render('urls_index', templateVars);
});

//LISTEN
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
