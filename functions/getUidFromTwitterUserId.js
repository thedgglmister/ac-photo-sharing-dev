const { admin } = require('./admin');
const db = admin.database();
const ref = db.ref();

const getUidFromTwitterUserId = (twitterUserId) => {
  const twitterAccountsRef = ref.child('twitterAccounts');

  const twitterAccountsQuery = twitterAccountsRef
                          .orderByChild('twitterUserId')
                          .equalTo(twitterUserId)
                          .limitToFirst(1);

  const twitterAccountPromise = new Promise((resolve, reject) => {
    twitterAccountsQuery.once('value', (snapshot) => {
      const twitterAccounts = snapshot.val();
      if (twitterAccounts && Object.keys(twitterAccounts).length == 1) {
        resolve({
          foundUid: Object.keys(twitterAccounts)[0],
        });
      }
      else {
        reject(new Error('Could not find Twitter Account'));
      }
    });
  });

  return twitterAccountPromise;
};

exports.getUidFromTwitterUserId = getUidFromTwitterUserId;
