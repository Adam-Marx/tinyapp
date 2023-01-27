//COMPARE BY EMAIL HELPER
const userLookUp = (email, database) => {
  let foundUser = null;
  for (const user in database) {
    const userID = database[user]
    if(userID.email === email) {
      return foundUser = userID;
    } 
  }
  return foundUser;
};

//RANDOM STRING HELPER
const generateRandomString = (length) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

//SPECIFIC URLS FOR USER HELPER
const urlsForUser = (user, database) => {
  let filteredUrls = {};
  for (const shortURL in database) {
    if (database[shortURL].userID === user) {
      filteredUrls[shortURL] = database[shortURL];
    }
  }
  return filteredUrls;
};



module.exports = { userLookUp, generateRandomString, urlsForUser };