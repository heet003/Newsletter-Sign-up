const express = require('express');
const request = require('request');
const https = require('https');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded(
    { extended: true }
))
app.use(express.static("public"));

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.post("/", function (req, res) {

    const fname = req.body.firstname;
    const lname = req.body.lastname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/bde0e2a9c6"
    const options = {
        method: "POST",
        auth: "heet:48556a95c816e97a97bc0b00e25a34de-us21"
    }

    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data));
            if (response.statusCode == 200) {
                res.sendFile(__dirname + "\\success.html");
            } else {
                res.sendFile(__dirname + "\\failure.html");
            }
        });
    })
    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3000, function () { });

app.get("/", function (req, res) {
    res.sendFile(__dirname + "\\signup.html");
})