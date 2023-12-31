import dotenv from "dotenv";

dotenv.config({});

import express from 'express';
import {google} from 'googleapis';
import axios from "axios";
import dayjs from "dayjs";

const calendar=google.calendar({
    version:"v3",
    auth:process.env.API_KEY,
})


const app   = express();

const PORT = process.env.NODE_ENV || 8000;

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL,
)

const scopes=[
    'https://www.googleapis.com/auth/calendar'
];

app.get('/google',  (req, res) => {
    const url=oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(url);
});

app.get('/google/redirect', async (req, res) => {
    const code=req.query.code;
    
    const {tokens} =await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    

    res.send({
        msg:"You have successfully Logged in",
    });
}); 

app.get('/schedule_event', async (req, res) => {
    try{
    await calendar.events.insert({
        calendarId:"primary",
        auth:oauth2Client,
        requestBody: {
            summary:"This is a Test Event",
            description:"Some event that is very very important",
            start:{
                dateTime:dayjs(new Date()).add(2,'day').toISOString(),
                timeZone:"Asia/Kolkata",
            },
            end:{
                dateTime:dayjs(new Date()).add(3,'day').add(1,"hour").toISOString(),
                timeZone:"Asia/Kolkata",
            }
        },
    });
    res.send({
        msg:"Done",
    });
}catch(e){
    res.send({msg:"Error",e});
}
});


app.listen(PORT, ()=>{  
    console.log("listening on port ", PORT);
});