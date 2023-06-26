const {verifyToken} = require("../services/tokenServices");
const tokenTypes = require('../services/token');
const {db} = require("../db/connections");


async function verifyUser(req, res, next){
    const authorization = req.headers.authorization
    try {
        if (!authorization) {
            return res.status(403).json({
                message: "Authorization required"
            })
        }
        const tokenPart = authorization.split(" ")
        if (tokenPart[0] === 'Bearer' &&  tokenPart[1].match(/\S*\.\S*\.\S*/)) {
            const tokenData = await verifyToken(tokenPart[1], tokenTypes.ACCESS)

            if(tokenData instanceof Error ) {
                return res.status(401).json({
                    message: tokenData.message
                });
            }
            const user = await db.oneOrNone(`SELECT * FROM user_account WHERE id=$1`, tokenData['accountId']);
            if (!user){
                res.status(403).json({
                    message: "You are not authorized"
                })
            }
            res.locals.accountId = tokenData['accountId']; // Store accountId in res.locals
            next();

        } else  {
            return res.status(403).json({
                message: "Access denied. No token provided."
            });
        }
    } catch (error){
        return res.status(error.code || 500).json({
            message: "Oops! An Error occurred." || error.message
        });
    }
}

module.exports = {verifyUser}