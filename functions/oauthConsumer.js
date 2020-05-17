const functions = require('firebase-functions');
const oauth = require('oauth');

const TWITTER_CONSUMER_KEY = functions.config()['twitter-app'].consumer_key;
const TWITTER_CONSUMER_SECRET = functions.config()['twitter-app'].consumer_secret;
const FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG);

const twitterBaseUrl = 'https://twitter.com';
const twitterRequestTokenPath = '/oauth/request_token';
const twitterAccessTokenPath = '/oauth/access_token';
const projectId = FIREBASE_CONFIG.projectId;

const consumer = new oauth.OAuth(
  `${twitterBaseUrl}${twitterRequestTokenPath}`,
  `${twitterBaseUrl}${twitterAccessTokenPath}`,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  '1.0A',
  `https://${projectId}.web.app/auth-page`,
  'HMAC-SHA1'
);


exports.consumer = consumer;
