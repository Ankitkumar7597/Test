const router = require('express').Router();

router.get('/', (req, res) => {
    let data = {
        tyep: 2,
        fileName: 'home',
        title: 'New structure of code'
    }
    res.render("front/index", { data });
});

// Export the router so it can be used in app.js
module.exports = router;
