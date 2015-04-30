module.exports = {
    sessionHandler: function (req, res, next) {
        res.locals.user = req.session ? req.session.user : null;
        res.locals.title = setting.title;
        res.locals.subtitle = setting.subtitle;
        res.locals.error = req.session ? null : 'session 未启用';
        next();
    },

    errorHandler: function (err, req, res, next) {
        res.status(500);
        res.render('error/500', {error: err});
    }
};