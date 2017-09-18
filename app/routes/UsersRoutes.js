module.exports = function(app) {
  	var UsersController = require('../controllers/UsersController');

  	app.route('/users/new').post(UsersController.store);

  	app.route('/users/:id')
  		.get(UsersController.show)
  		.post(UsersController.update);
};