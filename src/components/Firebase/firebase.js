import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


const isDev = process.env.REACT_APP_ENVIRONMENT == 'DEV';
const config = {
  apiKey: isDev ? process.env.REACT_APP_API_KEY_DEV : process.env.REACT_APP_API_KEY,
  authDomain: isDev ? process.env.REACT_APP_AUTH_DOMAIN_DEV : process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: isDev ? process.env.REACT_APP_DATABASE_URL_DEV : process.env.REACT_APP_DATABASE_URL,
  projectId: isDev ? process.env.REACT_APP_PROJECT_ID_DEV : process.env.REACT_APP_PROJECT_ID,
  storageBucket: isDev ? process.env.REACT_APP_STORAGE_BUCKET_DEV : process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: isDev ? process.env.REACT_APP_MESSAGING_SENDER_ID_DEV : process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
    this.RecaptchaVerifier = app.auth.RecaptchaVerifier;


    this.doSignInWithPhoneNumber = this.doSignInWithPhoneNumber.bind(this);
    this.doSignOut = this.doSignOut.bind(this);

    this.user = this.user.bind(this);
    this.users = this.users.bind(this);

    this.contacts = this.contacts.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
    this.updateContact = this.updateContact.bind(this);
    this.saveContact = this.saveContact.bind(this);

    this.tags = this.tags.bind(this);
    this.deleteTag = this.deleteTag.bind(this);

    this.twitterAccount = this.twitterAccount.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);

  }

  // *** Auth API ***
  // doCreateUserWithEmailAndPassword = function(email, password) {
  //   return this.auth.createUserWithEmailAndPassword(email, password);
  // }

  // doSignInWithEmailAndPassword = function(email, password) {
  //   return this.auth.signInWithEmailAndPassword(email, password);
  // }

  doSignInWithPhoneNumber = function(phoneNumber, recaptchaVerifier) {
    return this.auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
  }

  // phoneNumberExists = function(phoneNumber) {
  //   const usersRef = this.db.ref('users');
  //   const usersQuery = usersRef
  //                       .orderByChild('phoneNumber')
  //                       .equalTo(phoneNumber)
  //                       .limitToFirst(1);
  //   return usersQuery.once('value');
  // }


  doSignOut = function() {
    return this.auth.signOut();
  }

  // doPasswordReset = function(email) {
  //   return this.auth.sendPasswordResetEmail(email);
  // }

  // doPasswordUpdate = function(password) {
  //   return this.auth.currentUser.updatePassword(password);
  // }

  // *** User API ***


  user = function(uid) {
    return this.db.ref(`users/${uid}`);
  }

  users = function() {
    return this.db.ref('users');
  }




  // *** Contact API ***


  contacts = function(uid) {
    return this.db.ref(`contacts/${uid}`);
  }

  //TO DO TODO just pass contact instead of contactId. I already have contact, so
  //why query again? [just to make sure tags are up to date]
  deleteContact = async function(uid, contactId) {

    const contactTagsRef = this.db.ref(`contacts/${uid}/${contactId}/tags`);
    const contactTagsSnapshot = await contactTagsRef.once('value');
    const contactTags = contactTagsSnapshot.val();


    const updates = {
      [`contacts/${uid}/${contactId}`]: null,
    };

    if (contactTags) {
      for (let tag of Object.values(contactTags)) {
        const { tagId } = tag;
        updates[`tags/${uid}/${tagId}/contacts/${contactId}`] = null;
      }
    }

    return this.db.ref().update(updates);
  }

  updateContact = async function(uid, contactUpdates) {
    const { contactId, phoneNumber, fullPhoneNumber, name, tagsList, tagsToDeleteList } = contactUpdates;
    const contact = {
      contactId,
      name,
      phoneNumber,
      fullPhoneNumber,
    };


    const updates = {};
    for (let key in contact) {
      updates[`contacts/${uid}/${contactId}/${key}`] = contact[key];
    }

    const contactTagsRef = this.db.ref(`contacts/${uid}/${contactId}/tags`);

    for (let tag of tagsList) {
      tag.tagId = tag.tagId ? tag.tagId : contactTagsRef.push().key;
      updates[`contacts/${uid}/${contactId}/tags/${tag.tagId}`] = tag;
      for (let key in tag) {
        updates[`tags/${uid}/${tag.tagId}/${key}`] = tag[key];
      }
      updates[`tags/${uid}/${tag.tagId}/contacts/${contactId}`] = contact;
    }

    for (let tag of tagsToDeleteList) {
      updates[`contacts/${uid}/${contactId}/tags/${tag.tagId}`] = null;
      updates[`tags/${uid}/${tag.tagId}/contacts/${contactId}`] = null;
    }

    return this.db.ref().update(updates);
  }


  saveContact = function(uid, contact) {

    const contactsRef = this.db.ref(`contacts/${uid}`);
    const contactRef = contactsRef.push();
    const contactTagsRef = contactRef.child('tags');
    const contactId = contactRef.key;

    const { name, phoneNumber, fullPhoneNumber, tagsList } = contact;
    const contactUpdates = {
      name,
      phoneNumber,
      fullPhoneNumber,
      contactId,
    };

    const tagsMap = tagsList.reduce((soFar, tag) => {
      tag.tagId = tag.tagId ? tag.tagId : contactTagsRef.push().key;
      return Object.assign(soFar, {[tag.tagId]: tag});
    }, {});

    const updates = {
      [`contacts/${uid}/${contactId}`]: {
        ...contactUpdates,
        tags: tagsMap,
      },
    };

    //new tags can just add contact
    //preexisting tags need to

    for (let tagId in tagsMap) {
      const tagMap = tagsMap[tagId];
      for (let key in tagMap) {
        updates[`tags/${uid}/${tagId}/${key}`] = tagMap[key];
      }
      updates[`tags/${uid}/${tagId}/contacts/${contactId}`] = contactUpdates;

    }
    console.log(updates);


    return this.db.ref().update(updates);
  }




  // *** Tags API ***

  tags = function(uid) {
    return this.db.ref(`tags/${uid}`);
  }

  deleteTag = function(uid, contactId, tagId) {
    console.log(221);
    console.log(`tags/${uid}/${tagId}/contacts/${contactId}`);

    const updates = {
      [`tags/${uid}/${tagId}/contacts/${contactId}`]: null,
      [`contacts/${uid}/${contactId}/tags/${tagId}`]: null,
    };

    return this.db.ref().update(updates);
  }



  // *** Twitter Account API ***

  twitterAccount = function(uid) {
    return this.db.ref('twitterAccounts').child(uid);
  }

  deletePhoto = async function(uid, tweetId, photoId) {

    const photoTagsRef = this.db.ref(`twitterAccounts/${uid}/imageUrlsByTweetId/${tweetId}/${photoId}/tags`);
    const photoTagsSnapshot = await photoTagsRef.once('value');
    const photoTags = photoTagsSnapshot.val();

    const updates = {
      [`twitterAccounts/${uid}/imageUrlsByTweetId/${tweetId}/${photoId}`]: null,
    };


    if (photoTags) {
      for (let tag of Object.values(photoTags)) {
        const { tagId } = tag;
        updates[`tags/${uid}/${tagId}/photos/${photoId}`] = null;
      }
    }

    return this.db.ref().update(updates);
  }



  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              phoneNumber: authUser.phoneNumber,
              ...dbUser,
            };

            next(authUser);
          });
      }
      else {
        fallback();
      }
    });


}

export default Firebase;
