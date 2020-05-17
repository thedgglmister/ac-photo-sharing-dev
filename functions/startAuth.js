const functions = require('firebase-functions');
const { consumer } = require('./oauthConsumer');

const startAuth = functions.https.onRequest((req, res) => {

  consumer.getOAuthRequestToken((error, oauthRequestToken, oauthRequestTokenSecret, results) => {
    if (error) {
      console.log('Error getting OAuth request token:', error);
      res.status(500).send({
        error: `Error getting OAuth request token: ${JSON.stringify(error)}`,
      });
    }
    else {
      res.status(200).send({
        redirectUrl: `https://twitter.com/oauth/authorize?oauth_token=${oauthRequestToken}`,
        oauthRequestToken: oauthRequestToken,
        oauthRequestTokenSecret: oauthRequestTokenSecret,
     });
    }
  });
});

exports.startAuth = startAuth;
