require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'conference-secret-key',
    dbConfig: {
        database: process.env.DB_NAME || 'conference-db',
        username: process.env.DB_USER || 'user',
        password: process.env.DB_PASS || 'password',
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    },
    port: process.env.PORT || 3000
};