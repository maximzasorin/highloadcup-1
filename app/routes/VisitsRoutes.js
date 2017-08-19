module.exports = function(app) {
  	var VisitsController = require('../controllers/VisitsController');

  	// VisitsController Routes

  	// // TODO: remove for prod
  	// app.route('/visits').get(VisitsController.index);

  	app.route('/visits/new').post(VisitsController.store);

  	app.route('/visits/:visitId')
  		.get(VisitsController.show)
  		.post(VisitsController.update);

  	app.route('/users/:userId/visits')
  		.get(VisitsController.indexByUser)
};