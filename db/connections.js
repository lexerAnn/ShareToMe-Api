const bbp = require('bluebird');
require('dotenv').config();

const initComponents = {
    promiseLib: bbp
};

const pgp = require('pg-promise')(initComponents);
const cn = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const db = pgp(cn);


db.func('version')
    .then(data => {
        console.log('connection success', data)
    })
    .catch(error => {
        console.log('connection error' + error.message + cn)
    });

module.exports = { db };