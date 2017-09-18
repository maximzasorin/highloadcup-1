const mongo = require('../mongo'),
    Schema = require('../schema'),
    util = require('../util');

const userSchema = new Schema({
    id: Schema.Number,
    email: Schema.String,
    first_name: Schema.String,
    last_name: Schema.String,
    gender: Schema.Gender,
    birth_date: Schema.Number,
});

exports.show = function (req, res) {
    mongo(function (err, db) {
        db.collection('users')
            .findOne({ id: parseInt(req.params.id) }, function(err, user) {
                if (err || !user) {
                    return res.status(404).end();
                }

                util.send(res, '{' +
                    '"id":' + user.id + ',' +
                    '"email":"' + user.email + '",' +
                    '"first_name":"' + user.first_name + '",' +
                    '"last_name":"' + user.last_name + '",' +
                    '"gender":"' + user.gender + '",' +
                    '"birth_date":' + user.birth_date +
                '}');
            });
    });
};

exports.store = function (req, res) {
    let user = userSchema.parse(req.body);

    if (user) {
        mongo(function (err, db) {
            db.collection('users')
                .insert(user, function () {})
        });

        util.send(res, '{}');
    } else {
        res.status(400).end();
    }
};

exports.update = function(req, res) {
    let user = userSchema.parse(req.body, { required: false });

    if (!user || !Object.keys(user).length) {
        return res.status(400).end();
    }

    mongo(function (err, db) {
        db.collection('users')
            .findOneAndUpdate(
                { id: parseInt(req.params.id) },
                { $set: user },
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