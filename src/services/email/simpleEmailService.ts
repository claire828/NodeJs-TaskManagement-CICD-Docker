import AWS from 'aws-sdk';


export default async (account:string, title:string)=>{
    AWS.config.update({
        region:'us-east-2'
    });
    const fromAddress = 'iamclaire.cheng@gmail.com';
    const params = {
        Destination: {
            ToAddresses: [account]
        },
        Message: {
                Body: {
                    Text: {
                        Charset: "UTF-8",
                        Data: `Your draft [${title}] has been created`
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: `Message from Task Manager`
                }
            },
        Source: fromAddress,
        ReplyToAddresses: [ fromAddress ],
    };

    // Create the promise and SES service object
    const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    sendPromise.then(
    (data)=> {
        console.log(data.MessageId);
    }).catch(
        (err)=> {
        console.error(err, err.stack);
    });
    return sendPromise;
}

