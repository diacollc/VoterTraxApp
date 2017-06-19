﻿var express = require('express');
var router = express.Router();

/*
 * receive outbound message
 */

router.post('/', function (req, res) {
        
        var obj = req.body;
        
        //pull out organization id
        var orgId = obj['soapenv:envelope']['soapenv:body'].notifications.organizationid;
        
        //pull out voter object
        var voter = obj['soapenv:envelope']['soapenv:body'].notifications.notification.sobject;
        
        //get the voter's name
        var name = voter['sf:name'];
        console.log(name);
        
        //create variable that holds the acknowledgement
        var ack = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound"><soapenv:Header/><soapenv:Body><out:notificationsResponse><out:Ack>true</out:Ack></out:notificationsResponse></soapenv:Body></soapenv:Envelope>';
        
        //send message to connected sockets
        req.io.sockets.emit("outboundmessage", { votername: voter['sf:name'], mailingaddr: voter['sf:mailing_address__c'] });
        
        //return ack to Salesforce.com to confirm receipt
        res.send(ack);

    }
);

module.exports = router;