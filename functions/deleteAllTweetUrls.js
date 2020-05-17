const { admin } = require('./admin');
const db = admin.database();
const ref = db.ref();

const deleteAllTweetUrls = async (uid, tweetsToDeleteIds) => {

  const tweetsRef = ref.child(`twitterAccounts/${uid}/imageUrlsByTweetId`);
  const tweetsSnapshot = await tweetsRef.once('value');
  const tweets = Object.assign({}, tweetsSnapshot.val());

  const tweetsToDeleteList = Object.keys(tweets).reduce((soFar, tweetId) => {
    if (tweetsToDeleteIds.includes(tweetId)) {
      soFar.push(tweets[tweetId]);
    }
    return soFar;
  }, []);


  const updates = {};

  for (let tweetId of tweetsToDeleteIds) {
    updates[`twitterAccounts/${uid}/imageUrlsByTweetId/${tweetId}`] = null;
  }

  for (let tweetMap of tweetsToDeleteList) {
    for (let photo of Object.values(tweetMap)) {
      const tagsMap = photo.tags ? photo.tags : {};
      for (let tagId in tagsMap) {
        updates[`tags/${uid}/${tagId}/photos/${photo.photoId}`] = null;
      }
    }
  }

  return ref.update(updates);
};

exports.deleteAllTweetUrls = deleteAllTweetUrls;
