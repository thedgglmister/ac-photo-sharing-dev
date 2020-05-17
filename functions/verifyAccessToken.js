const { consumer } = require('./oauthConsumer');

const TWITTER_BASE_URL = 'https://api.twitter.com';
const TWITTER_VERIFY_PATH = '/1.1/account/verify_credentials.json';


const verifyAccessToken = (oauthAccessToken, oauthAccessTokenSecret) => {

  const verifyAccessTokenPromise = new Promise((resolve, reject) => {

    // return (
      consumer.get(
        `${TWITTER_BASE_URL}${TWITTER_VERIFY_PATH}`,
        oauthAccessToken,
        oauthAccessTokenSecret,
        (error, data, response) => {
          if (error) {
            return reject(error);
          }
          const parsedData = JSON.parse(data);
          return resolve({
            fullTwitterUser: parsedData,
          });
        }
      );
    // );
  });

  return verifyAccessTokenPromise;
};

exports.verifyAccessToken = verifyAccessToken;
