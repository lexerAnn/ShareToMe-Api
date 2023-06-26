const express = require('express')
const {verifyUser} = require("../utils/authUtil");
const {checkSchema, validationResult} = require("express-validator");
const {checkLink} = require("../schemas/validation");
const router = express.Router();
const { DateTime } = require('luxon');
const { JSDOM } = require('jsdom');
const {db} = require("../db/connections");
const rp = require('request-promise');
const {ApiResponse} = require("../utils/ApiResonse");




const link = {
    link: checkLink
}

router.post('/add-link', verifyUser, (req, res, next)=> {
    const accountId = res.locals.accountId; // Access accountId from res.locals
    console.log("AccountId" + accountId)

    const link = req.body['link']
    console.log(link)
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        res.status(400).json({  message: errors.array()[0]['msg'] });
    } else  {
        fetchURLTitle(link).then(title => {
            const currentTime = DateTime.now().toFormat('HH:mm:ss');
            const currentDate = DateTime.local().toFormat('LLLL dd');


            const notesData = [title, link, currentDate, currentTime, accountId]
            db.none('INSERT INTO notes(title, link, date, time, account_id ) VALUES ($1, $2,$3,$4,$5)', notesData)
                .then(_ => {
                    const data = {
                        title: title,
                        link: link,
                        date: currentDate,
                        time: currentTime
                    }

                    const response = new ApiResponse(
                        "success",
                        "Link Added Successfully",
                         data,
                        ""
                    )

                    res.status(200).json({
                        response
                    })
                })
                .catch(error => {
                    const response = new ApiResponse(
                        "error",
                        "An error occurred",
                        "",
                        ""
                    )
                    console.log(error)
                    res.status(501).json({ response })
                });



        })
    }
})

async function fetchURLTitle(url) {
    try {
        const html = await rp(url);
        const dom = new JSDOM(html);
        const title = dom.window.document.querySelector('title').textContent;
        return title;
    } catch (error) {
        console.error('Error fetching URL title:', ßerror);
    }
}
module.exports = router
