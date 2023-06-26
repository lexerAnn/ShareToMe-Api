const {ApiResponse} = require("../utils/ApiResonse");


const checkEmail = {
    optional: true,
    isEmail: {
        bail: true
    },
    trim: true,
    errorMessage:  new ApiResponse("500", "", "Invalid Email", "","An Error occured" )}
const checkPassword = {
    isLength: {
        options: {
            min: 8,
        },
        errorMessage:  new ApiResponse("500", "", "Password does not exceed 8 characters", "","An Error occurred" )
    }
}
const checkLink = {
    notEmpty: true,
    trim: true,
    errorMessage: 'Enter a valid URL'
}




module.exports = {checkEmail, checkPassword, checkLink}
