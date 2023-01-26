const userLookUp = (email) => {
  let foundUser = null;
  for (const user in users) {
    const userID = users[user]
    if(userID.email === email) {
      return foundUser = userID;
    } 
  }
  return foundUser;
};

const generateRandomString = (length) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const urlsForUser = (id) => {
  if (userID === urlDatabase[shortURL]) {
    
  }
};



// module.exports = { userLookUp, generateRandomString };