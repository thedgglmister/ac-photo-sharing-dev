const functions = require('firebase-functions');

const { getAccessToken } = require('./getAccessToken');
const { verifyAccessToken } = require('./verifyAccessToken');
const { subscribeToTweets } = require('./subscribeToTweets');
const { saveTwitterUser } = require('./saveTwitterUser');


const linkTwitter = functions.https.onRequest(async (req, res) => {

  const {
    uid,
    oauthRequestToken,
    oauthRequestTokenSecret,
    oauthVerifier
  } = req.body;

  try {
    const { oauthAccessToken, oauthAccessTokenSecret } =
        await getAccessToken(oauthRequestToken, oauthRequestTokenSecret, oauthVerifier);

    const { fullTwitterUser } =
        await verifyAccessToken(oauthAccessToken, oauthAccessTokenSecret);

    try {
      const { subscriptionId } =
          await subscribeToTweets(oauthAccessToken, oauthAccessTokenSecret);
    }
    catch (error) {
      //code 355: subscription already exists
      if (error.code != 355) {
        throw error;
      }
    }

    const twitterUser = {
      oauthAccessToken: oauthAccessToken,
      oauthAccessTokenSecret: oauthAccessTokenSecret,
      twitterUserId: fullTwitterUser.id_str,
      twitterScreenName: fullTwitterUser.screen_name,
      twitterPhoto: fullTwitterUser.profile_image_url_https.replace("_normal", ""),
    };

    await saveTwitterUser(uid, twitterUser);

    res.status(200).end();
  }
  catch (error) {
    //subscription already exists
    if (error.code == 355 && twitterUser) {
      res.status(200).end();
    }
    else {
      console.log('Error linking twitter account:', error);
      res.status(500).send({
        error: `Error linking twitter account: ${error}`,
      });
    }
  }

});

exports.linkTwitter = linkTwitter;
