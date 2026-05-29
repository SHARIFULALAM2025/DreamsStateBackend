require('dotenv').config();
const path = require('path'); // এই লাইনটি যোগ করুন

module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: { rejectUnauthorized: false }
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            // এখানে path.resolve ব্যবহার করা হয়েছে যেন Knex সঠিক ফোল্ডার খুঁজে পায়
            directory: path.resolve(__dirname, 'migrations'),
        },
    },
};