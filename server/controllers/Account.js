const models = require('../models');

const { Account } = models;

//Render Login Handlebar
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

//Render NotFound handlebar
const notFoundPage = (req, res) => {
  res.render('notFound', { csrfToken: req.csrfToken() });
};

//Logs out the user
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

//Logs in the user, redirects to Task Maker page
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

//Signs up the user, redirects to Task Maker page
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use.' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  }
};

//Changes the user's password, redirects to login page
const changePass = async (req, res) => {
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if (!newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(newPass);
    await Account.updateOne({ username: req.session.account.username }, { password: hash });
    return res.json({ redirect: '/logout' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }
};

//Helper method to get csrf token
const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

module.exports = {
  loginPage,
  notFoundPage,
  login,
  logout,
  signup,
  changePass,
  getToken,
};
