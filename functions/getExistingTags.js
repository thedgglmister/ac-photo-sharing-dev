const { admin } = require('./admin');
const db = admin.database();
const ref = db.ref();

const getExistingTags = (uid) => {
  const tagsRef = ref.child(`tags/${uid}`);


  const tagsPromise = new Promise((resolve, reject) => {
    tagsRef.once('value', (snapshot) => {
      console.log('snapshot val of tags:', snapshot.val());

      const existingTags = Object.assign({}, snapshot.val());
      resolve(existingTags);
    });
  });

  return tagsPromise;
};

exports.getExistingTags = getExistingTags;
