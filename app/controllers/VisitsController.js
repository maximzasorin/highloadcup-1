const mongo = require('../mongo'),
    Schema = require('../schema'),
    util = require('../util');

const visitSchema = new Schema({
    id: Schema.Number,
    location: Schema.Number,
    user: Schema.Number,
    visited_at: Schema.Number,
    mark: Schema.Number,
});

exports.show = function (req, res) {
    mongo(function (err, db) {
        db.collection('visits')
            .findOne({ id: parseInt(req.params.id) }, function(err, visit) {
                if (!visit) {
                    return res.status(404).end();
                }

                util.send(res, '{' +
                    '"id":' + visit.id + ',' +
                    '"location":' + visit.location + ',' +
                    '"user":' + visit.user + ',' +
                    '"visited_at":' + visit.visited_at + ',' +
                    '"mark":' + visit.mark +
                '}');
            });
    });
};

exports.store = function (req, res) {
    let visit = visitSchema.parse(req.body);

    if (visit) {
        mongo(function (err, db) {
            db.collection('visits')
                .insert(visit, function () {})
        });

        util.send(res, '{}');
    } else {
        res.status(400).end();
    }
};

exports.update = function (req, res) {
    let visit = visitSchema.parse(req.body, { required: false });

    if (!visit || !Object.keys(visit).length) {
        return res.status(400).end();
    }

    mongo(function (err, db) {
        db.collection('visits')
            .findOneAndUpdate(
                { id: parseInt(req.params.id) },
                { $set: visit },
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

const filterSchema = new Schema({
    fromDate: Schema.Number,
    toDate: Schema.Number,
    country: Schema.String,
    toDistance: Schema.Number,
});

exports.indexByUser = function (req, res) {
    mongo(function (err, db) {
        db.collection('users')
            .findOne({ id: parseInt(req.params.id) }, function(err, user) {
                if (!user) {
                    return res.status(404).end();
                }

                let filter = filterSchema.parse(req.query, { required: false });

                if (!filter) {
                    return res.status(400).end();
                }

                // Assemble query
                let query = [];

                // User
                query.push({ user: user.id });

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

                // Country
                if (filter.country) {
                    query.push({
                        'location.country': filter.country
                    });
                }

                // toDistance
                if (filter.toDistance) {
                    query.push({
                        'location.distance': {
                            $lt: parseInt(filter.toDistance)
                        }
                    });
                }

                // Make query
                db.collection('visits')
                    .aggregate([
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
                                $and: query
                            }
                        },
                        {
                            $sort: {
                                visited_at: 1
                            }
                        }
                    ],
                    function (err, results) {
                        let visits = results.map(function (visit) {
                            return '{' +
                                '"mark":' + visit.mark + ',' +
                                '"visited_at":' + visit.visited_at + ',' + 
                                '"place":"' + visit.location.place + '"' +
                            '}';
                        });

                        util.send(res, '{"visits":[' + visits.join(',') + ']}');
                    });
            });
    });
};