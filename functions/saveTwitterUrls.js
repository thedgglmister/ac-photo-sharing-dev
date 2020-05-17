const { admin } = require('./admin');
const db = admin.database();
const ref = db.ref();

const saveTwitterUrls = async (uid, tweetId, urls, matchedTagsMap) => {

  const imageUrlsByTweetIdRef = ref.child(
    `twitterAccounts/${uid}/imageUrlsByTweetId/${tweetId}`
  );

  const updates = {};
  const photos = urls.map((url) => {
    const photoId = imageUrlsByTweetIdRef.push().key;
    return {
      tweetId,
      photoId,
      url,
    };
  });

  for (let tag of Object.values(matchedTagsMap)) {
    delete tag.contacts;
  }


  for (let photo of photos) {
    updates[`twitterAccounts/${uid}/imageUrlsByTweetId/${tweetId}/${photo.photoId}`] = {
      ...photo,
      tags: matchedTagsMap,
    };
  }

  for (let tag of Object.values(matchedTagsMap)) {
    for (let photo of photos) {
      updates[`tags/${uid}/${tag.tagId}/photos/${photo.photoId}`] = photo;
    }
  }

  return ref.update(updates);

};


exports.saveTwitterUrls = saveTwitterUrls;
