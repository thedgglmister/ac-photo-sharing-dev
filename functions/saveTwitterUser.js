const { admin } = require('./admin');
const db = admin.database();
const ref = db.ref();

const saveTwitterUser = (uid, twitterUser) => {

  const twitterAccountsRef = ref.child('twitterAccounts');

  // const saveTwitterUserPromise = new Promise((resolve, reject) => {
    // return (
  return twitterAccountsRef.child(uid).set(twitterUser);
      //   (error) => {
      //     if (error) {
      //       return reject(error);
      //     }
      //     else {
      //       return resolve();
      //     }
      //   }
      // );
    // );
  // });

  // return saveTwitterUserPromise;
};

exports.saveTwitterUser = saveTwitterUser;
