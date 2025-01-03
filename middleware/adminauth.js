var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

let node_env = process.env.NODE_ENV;

if (node_env !== 'production') {
    exports.adminAuth = function (req, res, next) {
        if (localStorage.getItem('dXNlcg==') != null) {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            return next();
        } else {
            return res.redirect(admin);
        }
    }
} else {
    exports.adminAuth = function (req, res, next) {
        if (req.session.adminData) {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            return next();
        } else {
            return res.redirect(admin);
        }
    }
}


