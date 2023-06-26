const jwt =  require('jsonwebtoken')
const tokenType = require('./token')
const {DateTime} = require('luxon')
const {db} = require('../db/connections')
require('dotenv').config();


async function verifyToken(token, tokenType){
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error){
        return new Error("Invalid token " + error.message)
    }
}

function generateToken(userId, expires, type, secret = process.env.JWT_SECRET){
    const payload = {
        accountId: userId,
        iat: DateTime.now().toSeconds(),
        exp: expires.toSeconds(),
        type
    }
    return jwt.sign(payload, secret)
}

async function saveToken(token, accountId, expires, type){
    const tokenData = [token, type, expires, accountId]
    await db.none('INSERT INTO account_tokens(token, token_type, expires, account_id) VALUES ($1, $2, $3, $4) ON CONFLICT (account_id, token_type) DO UPDATE SET token=excluded.token, expires=excluded.expires', tokenData)
}

async function generateAuthTokens(accountId){

    const accessTokenExpires = DateTime.now().plus({
        days: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_DAYS)
    });

    const refreshTokenExpires = DateTime.now().plus({
        days: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_DAYS)
    });

    const accessToken = generateToken(accountId, accessTokenExpires, tokenType.ACCESS);
    const refreshToken = generateToken(accountId, refreshTokenExpires, tokenType.REFRESH);

    await saveToken(refreshToken, accountId, refreshTokenExpires, tokenType.REFRESH);

    return {
        accessToken,
        accessTokenExpires: accessTokenExpires.toHTTP(),
        refreshToken,
        refreshTokenExpires: refreshTokenExpires.toHTTP()
    };
}

module.exports = {verifyToken, generateAuthTokens}
