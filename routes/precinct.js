var express = require('express');
var router = express.Router();

var request = require('request');
var creds = require('../credentials.json');


router.get('/', function (req, res) {
    
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
            
            //retrieve voters by doing a query
            request({
                url: 'https://na50.salesforce.com/services/data/v35.0/query/?q=select+id,+name,+Political_Party__c,+Precinct__r.Name,+Mailing_Address__c+from+Voter__c+where+ Precinct__r.Name+=+%273rd District%27',
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
                    
                    //render page, provide list of voters
                    res.render('precinct', { title: 'Voter Trax Online', voters:vresult.records });
                }
            });
            

            
        }
    });   
});

module.exports = router;