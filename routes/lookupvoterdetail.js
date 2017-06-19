var express = require('express');
var router = express.Router();

var request = require('request');
var creds = require('../credentials.json');

router.post('/', function (req, res) {
    
    //pull out voter ID
    var id = req.body.voterid;
    
    //create request object to authenticate
    request({
        url: 'https://login.salesforce.com/services/oauth2/token', //oauth endpoint
        method: 'POST',
        form: {
            grant_type: 'password',
            client_id: creds.client_id,
            client_secret: creds.client_secret,
            username: creds.username,
            password: creds.password
        }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            var result = JSON.parse(body);
            var url = result.instance_url;
            var token = result.access_token;
            
            //console.log('url: ' + url);
            //console.log('token: ' + token);
            
            console.log('token acquired');
            
            //retrieve voter along with donations from custom service
            request({
                url: 'https://na50.salesforce.com/services/apexrest/VotersWithDonation/' + id,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }, function (verror, vresponse, vbody) {
                if (verror) {
                    console.log(verror);
                } else {
                    var vresult = JSON.parse(vbody);
                    console.log(vbody);
                    
                    res.contentType('json');
                    res.send({ voter: vresult });
                }
            });
        }
    });
});

module.exports = router;