module.exports = function(app) {
  	var LocationsController = require('../controllers/LocationsController');

  	// LocationsController Routes

  	// // TODO: remove for prod
  	// app.route('/locations').get(LocationsController.index);

  	app.route('/locations/new').post(LocationsController.store);

  	app.route('/locations/:locationId')
  		.get(LocationsController.show)
  		.post(LocationsController.update);

  	app.route('/locations/:locationId/avg')
  		.get(LocationsController.avg)
};