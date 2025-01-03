/**
 * db.js
 * @description :: exports values used to make connection with SQL database
 */

if (process.env.NODE_ENV === 'production') {
    module.exports = {
        HOST: process.env.HOST,
        USER: process.env.DATABASE_USERNAME,
        PASSWORD: process.env.DATABASE_PASSWORD,
        DB: process.env.DATABASE_NAME,
        dialect: process.env.DIALECT,
        port: process.env.DB_PORT,
    };
} else {
    module.exports = {
        HOST: process.env.DEVELOPMENT_HOST,
        USER: process.env.DEVELOPMENT_DATABASE_USERNAME,
        PASSWORD: process.env.DEVELOPMENT_DATABASE_PASSWORD,
        DB: process.env.DEVELOPMENT_DATABASE_NAME,
        dialect: process.env.DEVELOPMENT_DIALECT,
        port: process.env.DEVELOPMENT_DB_PORT,
    };
}
