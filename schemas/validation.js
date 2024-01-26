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

const linkIdSchema = {
    link_id: {
        in: ['body'], // specify that this field is expected in the body of the request
        errorMessage: 'Invalid link_id', // error message if validation fails
    },
    // ... include other fields if necessary
};




module.exports = {checkEmail, checkPassword, checkLink, linkIdSchema}
