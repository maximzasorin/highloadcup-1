module.exports = function (filterRules, req) {
	for (let param in filterRules) {
        let value = req.query[param];

        if (!value) {
            continue;
        }

        let type = filterRules[param];

        if (type == Number && isNaN(value)) {
            return false;
        } else if (Array.isArray(type) && !type.includes(value)) {
            return false;
        }
    }

    return true;
};