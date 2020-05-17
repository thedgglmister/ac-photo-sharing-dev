const functions = require('firebase-functions');
const Twit = require('twit');

const TWITTER_BASE_URL = 'https://api.twitter.com';
const TWITTER_SUBSCRIBE_PATH = 'account_activity/all/test/subscriptions';
const TWITTER_CONSUMER_KEY = functions.config()['twitter-app'].consumer_key;
const TWITTER_CONSUMER_SECRET = functions.config()['twitter-app'].consumer_secret;


const subscribeToTweets = (oauthAccessToken, oauthAccessTokenSecret) => {
  return new Promise((resolve, reject) => {
    const twit = new Twit({
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
      access_token: oauthAccessToken,
      access_token_secret: oauthAccessTokenSecret,
    });
    twit.post(TWITTER_SUBSCRIBE_PATH, {}, (err, data, response) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};






exports.subscribeToTweets = subscribeToTweets;
