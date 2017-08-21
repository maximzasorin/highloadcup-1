const mongoose = require('mongoose'),
    User = mongoose.model('Users');

exports.show = function (req, res) {
    User.findOne({ id: req.params.userId }, function(err, user) {
        if (err || !user) {
            return res.status(404).end();
        }

        res.json(user);
    });
};

exports.store = function (req, res) {
    var user = new User(req.body);

    user.save(function (err, user) {
        if (err) {
            return res.status(400).end();
        }

        res.json({});
    });
};

exports.update = function(req, res) {
    let bodyParams = [
        'email', 'first_name', 'last_name', 'gender', 'birth_date'
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

    User.findOneAndUpdate({ id: req.params.userId },
        req.body, { new: true, runValidators: true },
        function (err, user) {
            if (err) {
                return res.status(400).end();
            }

            if (!user) {
                return res.status(404).end();
            }

            res.json({});
        });
};