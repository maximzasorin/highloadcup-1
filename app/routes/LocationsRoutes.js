module.exports = function(app) {
  	var LocationsController = require('../controllers/LocationsController');

  	app.route('/locations/new').post(LocationsController.store);

  	app.route('/locations/:id')
  		.get(LocationsController.show)
  		.post(LocationsController.update);

  	app.route('/locations/:id/avg')
  		.get(LocationsController.avg);
};