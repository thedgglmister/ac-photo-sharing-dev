const { admin } = require('./admin');
const db = admin.database();
const ref = db.ref();

const getUserFromUid = (uid) => {
  const userRef = ref.child(`users/${uid}`);



  const userPromise = new Promise((resolve, reject) => {
    userRef.once('value', (snapshot) => {
      console.log('snapshot val of user:', snapshot.val());

      const user = snapshot.val();
      if (user) {
        resolve({
          foundUser: user,
        });
      }
      else {
        reject(new Error('Could not find User'));
      }
    });
  });

  return userPromise;
};

exports.getUserFromUid = getUserFromUid;
