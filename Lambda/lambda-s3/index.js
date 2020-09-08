const AWS = require('aws-sdk');
var ses = new AWS.SES({
    region: 'us-east-1'
});
var token_data="";
require('crypto').randomBytes(48, function(err, buffer) {
    if(err)
        return new Error(err);
  var token = buffer.toString('hex');
  token_data=token;
  
});

const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});

exports.handler = (event, context, callback) => {
    // console.log(event.Records[0].Sns);
    // var event_data = [JSON.parse(event).message];
    
    console.log("===========event============"+JSON.stringify(event));
    
    var event_data=[JSON.parse(event.Records[0].Sns.Message).message]
    // var event_data = event.Records[0].Sns.Message.split(" ");
    var params = {
        Item: {
            id: event_data[0],
            token: token_data,
            //message: event.Records[0].Sns.Message,
            ttl: (Math.floor(Date.now() / 1000) + 900).toString()
        },
        TableName: "csye6225-dynamo"
    };

    function putCheck() {
        return new Promise(function (resolve, reject) {
            docClient.put(params, function (err, data) {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(data);
                }
            });
        });
    }


    const params2 = {
        TableName: "csye6225-dynamo",
        KeyConditionExpression: 'id = :i',
        ExpressionAttributeValues: {
            ':i': event_data[0]
        }
    };


    function getRecord() {
        return new Promise(function (resolve, reject) {
            docClient.query(params2, function (err, data) {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(data);
                }
            });
        });
    }
    //let number;
    async function mainFunction() {
        let number;
        number = await getRecord();
        if (number.Items.length == 0) {
            let second;
            second = await putCheck();
            console.log("Email Sent");
            //await sendEmail(event.Records[0].Sns.Message);
            await sendEmail(JSON.parse(event.Records[0].Sns.Message).email);

        } else {
            console.log("here");

            if ((number.Items[0].ttl) < (Math.floor(Date.now() / 1000)).toString()) {
                let second;
                second = await putCheck();
                console.log("Resending Email");
                await sendEmail(JSON.parse(event.Records[0].Sns.Message).email);
                //await sendEmail(event.Records[0].Sns.Me);
            } else {
                console.log((number.Items[0].ttl) < (Math.floor(Date.now() / 1000)).toString() + "------IN ELSE") //ttl
                console.log("Token Expired");
            }
        }

    }
    mainFunction();
    console.log('after async call');


    function sendEmail(to_email) {
        var sender = "abhinavmathod1995@prod.csye6225su-abhinav.me"


        
        var links = "http://prod.csye6225su-abhinav.me/users/update";
 
        console.log(links + "mine");


        return new Promise(function (resolve, reject) {
            var eParams = {
                Destination: {
                    ToAddresses: [JSON.parse(event.Records[0].Sns.Message).email]
                },
                Message: {
                    Body: {
                        Html: {
                            //Data: links
                            Data: '<html><head>' +
                                '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
                                '<title>' + "Password Reset csye6225su-abhinav" + '</title>' +
                                '</head><body>' +
                                'This is the link to update your password. It is valid for fifteen minutes.' +
                                '<br><br>' +
                                "<a href=\"https://" + "prod.csye6225su-abhinav.me" + "/users/update?" + token_data + "\">" +
                                "https://" + "prod.csye6225su-abhinav.me" + "/users/update?" + token_data + "</a>"
                                +'</body></html>'
                        }
                    },
                    Subject: {
                        Data: "Reset your password"
                    }
                },
                Source: sender
            };
            ses.sendEmail(eParams, function (err, data2) {
                if (err) {
                    reject(new Error(err));
                } else {
                    context.succeed(event);
                    resolve(data2);
                }
            });
        });
    }


}