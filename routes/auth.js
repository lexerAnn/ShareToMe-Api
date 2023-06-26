const express = require('express');
const router = express.Router();
const {db} = require('../db/connections');
const bcrypt = require('bcrypt');
const {checkEmail, checkPassword} = require('../schemas/validation');
const {checkSchema, validationResult} = require('express-validator');
const ErrorResponse = require('../utils/ErrorResponse');
const tokenServices = require("../services/tokenServices");
const {ApiResponse} = require("../utils/ApiResonse");

require('dotenv').config();


const registerUser = {
    email: checkEmail,
    password: checkPassword
}

const loginUser = {
    email: checkEmail,
    password: checkPassword
}

router.post('/register' , checkSchema(registerUser), (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        res.status(400).json({message: errors.array()[0]['msg']});
    } else {
        const password = req.body['password']
        bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS), (encryptedError, encryptedPassword) => {

            if (encryptedError) next(new ErrorResponse('Oops! An error occurred while trying to save password', 500))

            const registerUserData = [req.body['email'], encryptedPassword];

            db.tx(async registerCallBack => {
                const checkRegistrationStatus = await registerCallBack.oneOrNone('SELECT id FROM user_account WHERE email = $1', req.body['email']);
                if (checkRegistrationStatus) {
                    return next(new ErrorResponse("Email already registered", 409))
                } else {
                    return await registerCallBack.one('INSERT INTO user_account(email, password) VALUES ($1, $2) RETURNING id', registerUserData);
                }
            })
            .then(async registerUserRow => {
                const tokens= await tokenServices.generateAuthTokens(registerUserRow['id']);
                res.header("x-auth-token", JSON.stringify(tokens));
                const response = new ApiResponse(
                    "success",
                    "Success",
                    "User registered successfully",
                    ""
                )
                res.status(201).json(response)
            })
            .catch((error) => {
                console.log(error)
                const response = new ApiResponse(
                    "error",
                    "Invalid Email or Password",
                    "",
                    ""
                )
                next(response);
            })
        })
    }

})

router.post('/login', checkSchema(loginUser), (req, res, next) => {
    performLoginAuth(req, res, next);
})

function performLoginAuth(req, res, next) {
    const errors = validationResult(req);

    const email = req.body['email'];
    const password = req.body['password'];

    if (!errors.isEmpty()) {
        return res.status(400).json({message: errors.array()[0]['msg']});
    } else {

        db.oneOrNone('SELECT * FROM user_account WHERE email = $1', email)
            .then((result) => {
                if (result) {
                    bcrypt.compare(password, result.password, async (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            const tokens = await tokenServices.generateAuthTokens(result.id);

                            res.header("x-auth-token", JSON.stringify(tokens));
                            return res.status(200).json({
                                message: "Login successful",
                            })
                        } else {
                            return res.status(401).json({
                                message: "Unauthenticated Failed",
                            })
                        }

                    })
                } else  {
                    return res.status(500).json({
                        message: "User does not exist",
                    })
                }
            }).catch(err => {

        });
    }
}

module.exports = router;
