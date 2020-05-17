const functions = require('firebase-functions');
const TWILIO_ACCOUNT_SID = functions.config().twilio.account_sid;
const TWILIO_AUTH_TOKEN = functions.config().twilio.auth_token;
const TWILIO_PHONE_NUMBER = functions.config().twilio.phone_number;
// const TWILIO_ACCOUNT_SID = 'AC1a8bcf894a49e8b13e238ece81c842a4';
// const TWILIO_AUTH_TOKEN = 'e0ec3c3f1e0e75d083bb979e132aec83';
// const TWILIO_PHONE_NUMBER = '+15105193332';

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


const sendTextMessages = async (user, contactsList, imageUrls) => {


  if (contactsList.length == 0) {
    console.log('no contacts to text');
    return;
  }

  const multiplePhotos = imageUrls.length > 1;
  const addtionalContacts = contactsList.length - 1;

  const textBody = `Hello.` +
                    ` ${user.username} shared` +
                    ` ${multiplePhotos ? 'these photos' : 'this photo'}` +
                    ` with you` +
                    ` ${addtionalContacts > 0 ? `and ${addtionalContacts} other${addtionalContacts > 1 ? 's' : ''}` : ''}`;


  for (let contact of contactsList) {
    const { fullPhoneNumber, name } = contact;

    console.log(`sending text to ${name}, ${fullPhoneNumber}`);
    client.messages.create({
      body: textBody,
      mediaUrl: imageUrls,
      from: TWILIO_PHONE_NUMBER,
      to: fullPhoneNumber,
    }).then((message) => {
      console.log(`text queued to ${name}`, message);
    })
    .catch((error) => {
      console.log(`text to ${name} error`, error);
    });
  }

  return;
  // client.messages.create({
  //   //body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
  //   mediaUrl: imageUrls,
  //   from: TWILIO_PHONE_NUMBER,
  //   to: '+15106767160'
  // })
  // .then(message => console.log(message))
  // .catch(error => console.log(error.message));
};

//sendTextMessages(null, ['https://pbs.twimg.com/media/EW1NCXuUwAEJ4ET.jpg']);


exports.sendTextMessages = sendTextMessages;
