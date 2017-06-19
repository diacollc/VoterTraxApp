$(document).ready(function () {
    $('.btn-details').click(function () {
        
        //get the voter id
        var id = $(this).attr("value");
        
        //clear table rows
        $('#voterdetails').find('tr').remove();
        
        //make server side request for voter details
        $.ajax({
            url: "/lookupdetail",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ voterid: id }),
            contentType: "application/json",
            cache: false,
            timeout: 5000,
            complete: function () {
                //called when complete
                //alert('complete');
            },
            
            success: function (data) {
                
                //create table based on voter detail results
                $('#voterdetails').append('<tr><td class=\'voterdetailheader\'>Name:</td><td>'+ data.voter.VoterName +'</td></tr>');
                $('#voterdetails').append('<tr><td class=\'voterdetailheader\'>Party:</td><td>' + data.voter.VoterParty + '</td></tr>');
                for (var i = 0; i < data.voter.Donations.length; i++) {
                    $('#voterdetails').append('<tr><td class=\'voterdetailheader\'>Donation:</td><td>' + data.voter.Donations[i].Donation_Date__c + ' - '+ data.voter.Donations[i].Candidate_Name__c +' ($'+ data.voter.Donations[i].Amount__c +')</td></tr>');
                }
            },
            
            error: function () {
                alert('error');
            },
        });
        
        return false;
    });    
});