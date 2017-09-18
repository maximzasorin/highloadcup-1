const mongo = require('../mongo'),
    Schema = require('../schema'),
    util = require('../util');

const locationSchema = new Schema({
    id: Schema.Number,
    place: Schema.String,
    country: Schema.String,
    city: Schema.String,
    distance: Schema.Number,
});

exports.show = function (req, res) {
    mongo(function (err, db) {
        db.collection('locations')
            .findOne({ id: parseInt(req.params.id) }, function(err, location) {
                if (err || !location) {
                    return res.status(404).end();
                }

                util.send(res, '{' +
                    '"id":' + location.id + ',' +
                    '"country":"' + location.country + '",' +
                    '"city":"' + location.city + '",' +
                    '"place":"' + location.place + '",' +
                    '"distance":' + location.distance +
                '}');
            });
    });
};

exports.store = function (req, res) {
    let location = locationSchema.parse(req.body);

    if (location) {
        mongo(function (err, db) {
            db.collection('locations')
                .insert(location, function () {})
        });

        util.send(res, '{}');
    } else {
        res.status(400).end();
    }
};

exports.update = function (req, res) {
    let location = locationSchema.parse(req.body, { required: false });

    if (!location || !Object.keys(location).length) {
        return res.status(400).end();
    }

    mongo(function (err, db) {
        db.collection('locations')
            .findOneAndUpdate(
                { id: parseInt(req.params.id) },
                { $set: location },
                { new: true },
                function (err, result) {
                    if (!result.value) {
                        return res.status(404).end();
                    }

                    util.send(res, '{}');
                }
            );
    });
};

const avgSchema = new Schema({
    fromDate: Schema.Number,
    toDate: Schema.Number,
    fromAge: Schema.Number,
    toAge: Schema.Number,
    gender: Schema.Gender,
});

exports.avg = function (req, res) {
    mongo(function (err, db) {
        db.collection('locations')
            .findOne({ id: parseInt(req.params.id) }, function (err, location) {
                if (!location) {
                    return res.status(404).end();
                }

                let filter = avgSchema.parse(req.query, { required: false });

                if (!filter) {
                    return res.status(400).end();
                }

                // Assemble query
                let query = [];

                // Location
                query.push({ location: location.id });

                // From date
                if (filter.fromDate) {
                    query.push({
                        visited_at: {
                            $gt: parseInt(filter.fromDate)
                        }
                    });
                }

                // To date
                if (filter.toDate) {
                    query.push({
                        visited_at: {
                            $lt: parseInt(filter.toDate)
                        }
                    });
                }

                // User conditions
                if (filter.gender) {
                    query.push({
                        'user.gender': filter.gender
                    });
                }

                if (filter.fromAge) {
                    query.push({
                        'user.birth_date': {
                            $lt: util.getTimeFromAge(filter.fromAge)
                        }
                    });
                }

                if (filter.toAge) {
                    query.push({
                        'user.birth_date': {
                            $gt: util.getTimeFromAge(filter.toAge)
                        }
                    });
                }

                // Make query
                db.collection('visits')
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
                                $and: query
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
                    ],
                    function (err, results) {
                        let avg = results.length
                            ? util.round(results[0].avg)
                            : 0

                        util.send(res, '{"avg":' + avg + '}');
                    });
            });
    });
};