const express = require('express');
const route = express.Router();

const chalk = require('chalk');

const { userValidation } = require('../Validation/joiValidation');

const MODEL = require('../Database/user');

const nodemailer = require('nodemailer');

const nodemailerSendgrid = require('nodemailer-sendgrid');

const jwt = require('jsonwebtoken');

const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const transport = nodemailer.createTransport(nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY
}));

route.post('/signup', async (req, res)=>{
    
    let { error } = userValidation(req.body);
    
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { name, email, gender, password } = req.body;

    let isExist = await MODEL.findOne({ email: email });

    if (isExist) { return res.status(400).send('email is exist'); }

    const token = jwt.sign({ name, email, gender, password }, process.env.JWT_SECURITY_KEY, { expiresIn: '20m' });
    console.log(chalk.yellow(token));
    
    transport
        .sendMail({
            from: 'shatpatel000@gmail.com',
            to: email,
            subject: 'Account verification',
            html: `<h1>Account verification Link</h1>
                ${name} <br> ${process.env.CLIENT_URL}/authentication/${token} `
        })
        .then(([resp]) => {
            // console.log('Email Has Been Send', res.statusCode, res.statusMessage);
            res.json({
                message: ' Email has send successfully kindly verify your account'
            })
        })
        .catch(err => {
            console.log('Errors occurred, failed to deliver message');

            if (err.response && err.response.body && err.response.body.errors) {
                err.response.body.errors.forEach(error => console.log('%s: %s', error.field, error.message));
            } else {
                console.log(err);
            }
        });




    res.send('O');

});


module.exports = route;