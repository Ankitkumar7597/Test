var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

let node_env = process.env.NODE_ENV;

if (node_env !== 'production') {
    exports.adminNoAuth = function (req, res, next) {
        if (localStorage.getItem('dXNlcg==') == null) {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            return next();
        } else {
            return res.redirect(admin + '/dashboard');
        }

    }
} else {
    exports.adminNoAuth = function (req, res, next) {
        if (req.session.adminData == undefined) {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            return next();
        } else {
            return res.redirect(admin + '/dashboard');
        }
    }
}
