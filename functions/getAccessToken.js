const { consumer } = require('./oauthConsumer');

const getAccessToken = (oauthRequestToken, oauthRequestTokenSecret, oauthVerifier) => {

  const getAccessTokenPromise = new Promise((resolve, reject) => {
    // return (
      consumer.getOAuthAccessToken(
        oauthRequestToken,
        oauthRequestTokenSecret,
        oauthVerifier,
        (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
          if (error) {
            return reject(error);
          }
          return resolve({
            oauthAccessToken,
            oauthAccessTokenSecret
          });
        }
      );
    // );
  });

  return getAccessTokenPromise;

};

exports.getAccessToken = getAccessToken;
