module.exports = function(app) {
  	var UsersController = require('../controllers/UsersController');

  	// UsersController Routes

  	// // TODO: remove for prod
  	// app.route('/users').get(UsersController.index);

  	app.route('/users/new').post(UsersController.store);

  	app.route('/users/:userId')
  		.get(UsersController.show)
  		.post(UsersController.update);
};