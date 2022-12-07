const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getTasks', mid.requiresLogin, controllers.Task.getTasks);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.post('/changepass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePass);

  app.get('/maker', mid.requiresLogin, controllers.Task.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Task.makeTask);

  app.post('/delete', mid.requiresLogin, controllers.Task.deleteTask);

  app.post('/update', mid.requiresLogin, controllers.Task.updateTask);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('*', controllers.Account.notFoundPage)
};

module.exports = router;