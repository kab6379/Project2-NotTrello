//Redirects the user if not logged in
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

//Redirects the user if logged in
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/maker');
  }
  return next();
};

//Redirects if unsecure
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

//Bypasses secure
const bypassSecure = (req, res, next) => {
  next();
};

//Exports
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
