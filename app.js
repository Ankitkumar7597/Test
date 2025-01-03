// Load environment variables
require('dotenv').config();

// Import required modules
const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const date = require('date-and-time');
const path = require('path');
const session = require("express-session");
const cors = require('cors'); // Import the cors middleware\
const multer = require('multer');

// Set global base directory
global.__basedir = __dirname;

// Import custom modules
const models = require('./model/index');
const seeder = require('./seeders');
const router = require('./routes');
const deviceRouter = require('./routes/device/index');
const adminRouter = require('./routes/admin/index');
const responseHandler = require('./utils/response/responseHandler');
const constants = require('./constants/index')

// Initialize the application
const app = express();
app.use(cors());
// Set up view engine
app.set('views', path.join(__basedir, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__basedir, 'public')));
app.use(express.json());

// Global variables
const now = new Date();
global.cur_date = date.format(now, 'YYYY-MM-DD');
global.admin = process.env.ADMIN;
global.front = process.env.BASE_URL;
global.node_env = process.env.NODE_ENV;
global.constants_value = constants

// Set timezone
process.env.TZ = "Asia/Calcutta";

// Configure session
const oneDay = 24 * 60 * 60 * 1000;
app.use(session({
    key: "user_sid",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
}));

// Middleware
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(responseHandler);

// Use routers
app.use(router);
app.use(global.admin, adminRouter);
app.use('/device', deviceRouter);

// Sync database and seed data
(async function syncAndSeed() {
    try {
        await models.sequelize.sync({ alter: true });
        console.log("Tables synced successfully");

        await seeder();
        console.log('Seeding done.');
    } catch (error) {
        console.error("Error during sync or seeding:", error);
    }
})();

// Catch 404 errors and forward to error handler
app.use((req, res, next) => {
    const status = 404; // Example status, can be dynamic
    const message = "Not Found"; // Example message, can be dynamic
    const properties = { detail: "Additional error info" }; // Example additional properties

    const error = createError(status, message, properties);

    // Console log the error
    /*  console.error("Error Status:", error.status);
     console.error("Error Message:", error.message);
     console.error("Error Properties:", error); */

    // Render dynamic error page based on status
    if (status === 404) {
        res.status(404).render('error.ejs', { status, message, error });
        // res.render('template/error/404.ejs');

    }
});

 


// Start server
const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Running in ${global.node_env || 'unknown'} mode`);
});


//added by aalekh 


//hello


// added by ankit


//new code changes


//1