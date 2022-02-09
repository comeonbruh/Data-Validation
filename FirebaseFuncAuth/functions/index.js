const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const express = require("express");
const db = admin.firestore();
const app = express();


const {body, validationResult} = require('express-validator')


//creating a user
/*Validating the data passed
Email-Required and verify it's a valid emailsender
firstName - Required
lastName - Required
age- Required and must be a integer
password - Required and Min length of 6 characters
userType -  Must be either "admin" or "customer"
language - Optional, but if added must be either "javascript","python","C#"*/
//alt+shift+f2 to format 
const userCreationValidators = [
    body('email').notEmpty().isEmail(),
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('age').notEmpty().isInt(), 
    body('password').notEmpty().isLength({min: 6}),
    body('userType').notEmpty().isIn(['admin','customer']),
    body('languages').optional().isIn(['javascript','python','C#'])
]
app.post('/', userCreationValidators ,async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(300).json({errors: errors.array()})
    }
    const user = req.body;
    await db.collection('users').add(user);
    res.status(201).send(JSON.stringify(user));
})

exports.user =  functions.https.onRequest(app)

