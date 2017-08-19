var mongoose = require('mongoose'),
    Visit = mongoose.model('Visits'),
    User = mongoose.model('Users'),
    validateQuery = require('../validateQuery');

// // TODO: remove for prod
// exports.index = function (req, res) {
//     Visit.find({}, function (err, visits) {
//         if (err) {
//             return res.status(400).end();
//         }

//         res.json(visits);
//     });
// };

exports.indexByUser = function (req, res) {
    User.findOne({ id: req.params.userId }, function (err, user) {
        if (err || !user) {
            return res.status(404).end();
        }

        // Validate filter params
        let filterRules = {
            fromDate: Number,
            toDate: Number,
            toDistance: Number,
        };

        if (!validateQuery(filterRules, req)) {
            return res.status(400).end();
        }

        // Assemble filter
        let filter = [];

        // User
        filter.push({ user: user.id });

        // From date
        if (req.query.fromDate) {
            filter.push({
                visited_at: {
                    $gt: parseInt(req.query.fromDate)
                }
            });
        }

        // To date
        if (req.query.toDate) {
            filter.push({
                visited_at: {
                    $lt: parseInt(req.query.toDate)
                }
            });
        }

        // Country
        if (req.query.country) {
            filter.push({
                'location.country': req.query.country
            });
        }

        // toDistance
        if (req.query.toDistance) {
            filter.push({
                'location.distance': {
                    $lt: parseInt(req.query.toDistance)
                }
            });
        }

        // Make query
        Visit.aggregate([
            {
                $lookup: {
                    from: 'locations',
                    localField: 'location',
                    foreignField: 'id',
                    as: 'location'
                }
            },
            {
                $unwind: { path: '$location' }
            },
            {
                $match: {
                    $and: filter
                }
            },
            {
                $sort: {
                    visited_at: 1
                }
            }
        ])
        .exec(function (err, results) {
            if (err) {
                return res.status(400).end();
            }

            let visits = results.map(function (result) {
                return {
                    mark: result.mark,
                    visited_at: result.visited_at,
                    place: result.location.place,
                };
            });

            res.json({ visits });
        });
    });
};

exports.show = function (req, res) {
    Visit.findOne({ id: req.params.visitId }, function(err, visit) {
        if (err || !visit) {
            return res.status(404).end();
        }

        res.json(visit);
    });
};

exports.store = function (req, res) {
    var visit = new Visit(req.body);

    visit.save(function (err, visit) {
        if (err) {
            return res.status(400).end();
        }

        res.json({});
    });
};

exports.update = function(req, res) {
    let bodyParams = [
        'location', 'user', 'visited_at', 'mark'
    ];

    let paramExists = false;
    for (let param of bodyParams) {
        if (req.body[param]) {
            paramExists = true;
        }
    }

    if (!paramExists) {
        return res.status(400).end();
    }

    Visit.findOneAndUpdate({ id: req.params.visitId },
        req.body, { new: true, runValidators: true },
        function (err, visit) {
            if (err) {
                return res.status(400).end();
            }

            if (!visit) {
                return res.status(404).end();
            }

            res.json({});
        });
};