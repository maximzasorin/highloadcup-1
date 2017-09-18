module.exports = function(app) {
    var VisitsController = require('../controllers/VisitsController');

    app.route('/visits/new').post(VisitsController.store);

    app.route('/visits/:id')
        .get(VisitsController.show)
        .post(VisitsController.update);

    app.route('/users/:id/visits')
        .get(VisitsController.indexByUser)
};