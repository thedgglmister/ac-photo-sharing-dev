const functions = require('firebase-functions');
const { admin } = require('./admin');
const db = admin.database();
const ref = db.ref();


const userAlreadyExists = functions.https.onRequest(async (req, res) => {
  console.log('in userAlreadyExists');

  const {
    phoneNumber,
    username,
  } = req.body;
  console.log('username', username);
  console.log('phoneNumber', phoneNumber);


  const usersRef = ref.child('users');

  const phoneNumberQuery = usersRef
                      .orderByChild('phoneNumber')
                      .equalTo(phoneNumber)
                      .limitToFirst(1);

  const usernameQuery = usersRef
                      .orderByChild('lc_username')
                      .equalTo(username ? username.toLowerCase() : '')
                      .limitToFirst(1);
  try {
    const phoneNumberMatchSnapshot = await phoneNumberQuery.once('value');
    const phoneNumberMatch = phoneNumberMatchSnapshot.val();
    const usernameMatchSnapshot = await usernameQuery.once('value');
    const usernameMatch = usernameMatchSnapshot.val();
    console.log('phoneNumberMatch', phoneNumberMatch);
    console.log('usernameMatch', usernameMatch);

    res.status(200).send({
      phoneNumberMatch: !!phoneNumberMatch,
      usernameMatch: !!usernameMatch,
    });
  }
  catch (error) {
    console.log('Error checking for user:', error);
    res.status(500).send(error);
  }

});

exports.userAlreadyExists = userAlreadyExists;
