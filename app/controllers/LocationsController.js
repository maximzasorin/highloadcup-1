const mongoose = require('mongoose'),
    Location = mongoose.model('Locations'),
    Visit = mongoose.model('Visits'),
    validateQuery = require('../validateQuery');

exports.show = function (req, res) {
    Location.findOne({ id: req.params.locationId }, function(err, location) {
        if (err || !location) {
            return res.status(404).end();
        }

        res.json(location);
    });
};

exports.avg = function (req, res) {
    let locationId = parseInt(req.params.locationId);

    Location.findOne({ id: locationId }, function(err, location) {
        if (err) {
            return res.status(400).end();
        }

        if (!location) {
            return res.status(404).end();
        }

        // Validate filter params
        let filterRules = {
            fromDate: Number,
            toDate: Number,
            fromAge: Number,
            toAge: Number,
            gender: ['m', 'f'],
        };

        if (!validateQuery(filterRules, req)) {
            return res.status(400).end();
        }

        // Assemble filter
        let filter = [];

        // Location
        filter.push({
            location: locationId
        });

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

        // User conditions
        if (req.query.gender) {
            filter.push({
                'user.gender': req.query.gender
            });
        }

        function getTime(age) {
            let date = new Date(global.NOW);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setFullYear(date.getFullYear() - age);

            return Math.floor(date.getTime() / 1000);
        }

        if (req.query.fromAge) {
            filter.push({
                'user.birth_date': {
                    $lt: getTime(parseInt(req.query.fromAge))
                }
            });
        }

        if (req.query.toAge) {
            filter.push({
                'user.birth_date': {
                    $gt: getTime(parseInt(req.query.toAge))
                }
            });
        }

        // Make query
        Visit
            .aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: 'id',
                        as: 'user'
                    }
                },
                {
                    $unwind: { path: '$user' }
                },
                {
                    $match: {
                        $and: filter
                    }
                },
                {
                    $group: {
                        _id: '$location',
                        avg: {
                            $avg: '$mark'
                        }
                    }
                }
            ])
            .exec(function (err, results) {
                if (err) {
                    return res.status(400).end();
                }

                let avg = results.length
                    ? Math.round(results[0].avg * 100000) / 100000
                    : 0

                res.json({
                    avg
                });
            });
    });
};

exports.store = function (req, res) {
    var location = new Location(req.body);

    location.save(function (err, location) {
        if (err) {
            return res.status(400).end();
        }

        res.json({});
    });
};

exports.update = function(req, res) {
    let bodyParams = [
        'place', 'country', 'city', 'distance'
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

    Location.findOneAndUpdate({ id: req.params.locationId },
        req.body, { new: true, runValidators: true },
        function (err, location) {
            if (err) {
                return res.status(400).end();
            }

            if (!location) {
                return res.status(404).end();
            }

            res.json({});
        });
};