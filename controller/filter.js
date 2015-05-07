var setting = require('../setting');
module.exports = {
    sessionHandler: function (req, res, next) {
        console.log("session");
        res.user = req.session ? req.session.user : null;
        res.error = req.session ? null : 'session 未启用';
        next();
    },

    errorHandler: function (err, req, res, next) {
        res.status(500);
        res.render('error/500', {error: err});
    }
};