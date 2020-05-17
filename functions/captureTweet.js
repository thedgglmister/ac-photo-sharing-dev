const functions = require('firebase-functions');
const crypto = require('crypto');

const { getExistingTags } = require('./getExistingTags');

const { saveTwitterUrls } = require('./saveTwitterUrls');
const { sendTextMessages } = require('./sendTextMessages');

const { deleteAllTweetUrls } = require('./deleteAllTweetUrls');
const { getUidFromTwitterUserId } = require('./getUidFromTwitterUserId');
const { getUserFromUid } = require('./getUserFromUid');



const CONSUMER_SECRET = functions.config()['twitter-app'].consumer_secret;

//TO DO TODO look up user phone number and text them if the tweet didnt
//get captured, or if the message didnt get sent. I think I need to use a
//callback to see if the message gets sent or failed.
const captureTweet = functions.https.onRequest(async (req, res) => {


  if (req.method == 'GET') {
    ///this is here because twitter needs to make a GET to the subscription
    //callback, at time of subscribe, to make sure it's safe.
    const { status, responseBody } = handleCRC(req);
    res.status(status).send(responseBody);
  }

  else if (req.method == 'POST') {

    console.log('req body:', req.body);
    const twitterUserId = req.body.for_user_id;
    let uid;
    let user;

    //TO DO TODO, this is dumb. make a ref that has user info by twitterId
    try {
      const { foundUid } = await getUidFromTwitterUserId(twitterUserId);
      const { foundUser } = await getUserFromUid(foundUid);

      uid = foundUid;
      user = foundUser;

      console.log('uid:', uid);
      console.log('user:', user);
    }
    catch (error) {
      console.log('Error getting uid and user from TwitterUserId:', error);
      res.status(500).end();
    }


    if (req.body.tweet_create_events) {
      // right now its assuming only one tweet.
      const tweet = req.body.tweet_create_events[0];
      const tweetId = tweet.id_str;
      console.log('the tweet', tweet);

      //It should be enough to check user.id_str and source includes Nintendo
      //Switch Share, but including other conditions to be safe.
      if (
          tweet.source.includes('Nintendo Switch Share') &&
          tweet.user.id_str === twitterUserId &&
          !tweet.is_quote_status &&
          !tweet.retweeted_status &&
          !tweet.in_reply_to_status_id_str
      ) {
        console.log('text:', tweet.text);
        console.log('extended entities:', tweet.extended_entities);
        console.log('user:', tweet.user);

        const lc_hashtagNames = parseTweetForHashtags(tweet.text);

        const imageUrls = [];
        for (let photoObj of tweet.extended_entities.media) {
          imageUrls.push(photoObj.media_url_https);
        }
        console.log('imageUrls:', imageUrls);







        let existingTags;
        try  {
          existingTags = await getExistingTags(uid);
        }
        catch (error) {
          console.log('Error getting existing tags', error);
          res.status(500).end();
        }

        const matchedTagsMap = {};
        for (let tag of Object.values(existingTags)) {
          if (lc_hashtagNames.includes(tag.lc_tagName)) {
            console.log('matched tag', tag);
            console.log(tag.contacts);
            matchedTagsMap[tag.tagId] = tag;
          }
        }
        console.log('macthdTags before copying');
        console.log(matchedTagsMap);
        const matchedTagsMapCopy = JSON.parse(JSON.stringify(matchedTagsMap));
        console.log('macthdTags after copying');
        console.log(matchedTagsMap);

        try  {
          await saveTwitterUrls(uid, tweetId, imageUrls, matchedTagsMapCopy);
        }
        catch (error) {
          console.log('Error saving twitter urls', error);
          res.status(500).end();
        }




        console.log('macthdTags before getting contacts');
        console.log(matchedTagsMap);

        const sendToContacts = [];
        for (let tagId in matchedTagsMap) {
          const tagContacts = existingTags[tagId].contacts;
          const tagContactsList = tagContacts ? Object.values(tagContacts) : [];
          if (tagContactsList.length > 0) {
            sendToContacts.push(...tagContactsList);
          }
        }



        console.log('about to try to send texts');
        try {
          if (sendToContacts.length > 0) {
            const messageData = await sendTextMessages(user, sendToContacts, imageUrls);
            console.log('messageData:', messageData);
          }
          else {
            console.log('no sendToContacts');
          }
          res.status(200).end();
        }
        catch (error) {
          console.log('Error sending texts', error);
          res.status(500).end();
        }





      }
      else {
        console.log('Not a Nintendo Switch Share create event');
        res.status(200).end();
      }
    }
    else if (req.body.tweet_delete_events) {
      //TO DO TODO: potential minor issue. does un-retweeting a retweet of your
      //own nintendo switch share tweet cause it to get deleted?
      const tweetIds = req.body.tweet_delete_events.map((deleteInfo) => (deleteInfo.status.id));

      try  {
        await deleteAllTweetUrls(uid, tweetIds);
        res.status(200).end();
      }
      catch (error) {
        console.log('Error deleting tweet urls:', error);
        res.status(500).end();
      }
    }
    else {
      console.log('Not a tweet_create_event or tweet_delete_event');
      res.status(200).end();
    }
  }

  res.status(404)
});


const handleCRC = (req) => {
  if (req.query.crc_token) {
    const sha256HashDigest = crypto.createHmac('sha256', CONSUMER_SECRET).update(req.query.crc_token).digest('base64');
    const crcResponse = {
      'response_token': 'sha256=' + sha256HashDigest
    };
    return {
      status: 200,
      responseBody: JSON.stringify(crcResponse),
    };
  }
  else {
    return {
      status: 400,
      responseBody: null,
    };
  }
};


const parseTweetForHashtags = (text) => {
  text = text ? text : '';
  return text.split(/\s/).filter((word) => word.startsWith('#')).map((hashtag) => hashtag.slice(1, hashtag.length).toLowerCase());
};

exports.captureTweet = captureTweet;
