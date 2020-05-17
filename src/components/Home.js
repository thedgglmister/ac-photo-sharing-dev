import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { compose } from 'recompose';

import * as ROUTES from '../constants/routes';
import UserInfo from './UserInfo';
import Navigation from './Navigation';
import PhotosTab from './PhotosTab';
import ContactsTab from './ContactsTab';
import withHeader from './WithHeader';







// import { withAuthorization } from './Session';


class Home extends React.Component {

  constructor(props) {
    super(props);

    const locationState = this.props.location.state;

    const currentTab = `/${window.location.pathname.split('/')[1]}`



    this.state = {
      error: locationState ? locationState.error : null,
      currentTab: currentTab,
    };

    this.setCurrentTab = this.setCurrentTab.bind(this);
  }

  setCurrentTab(currentTab) {
    this.setState({
      currentTab,
    });
  }


  render() {
    const { error, currentTab } = this.state;
    const { authUser, contacts, twitterAccount, tags } = this.props;
    const { uid } = authUser;

    const stats = {
      contactsCount: contacts ? Object.keys(contacts).length : 0,
      photosCount: 0
    }

    if (twitterAccount && twitterAccount.imageUrlsByTweetId) {
      stats.photosCount = Object.values(twitterAccount.imageUrlsByTweetId).reduce((soFar, tweetPhotos) => {
        return soFar + Object.keys(tweetPhotos).length;
      }, 0)
    }

    const tagsClone = JSON.parse(JSON.stringify(tags));
    const existingTagsList = !tagsClone ? [] : Object.values(tagsClone).map(tag => {
      delete tag.contacts;
      return tag;
    });


    const homePageStyle = {
      margin: 'auto',
      maxWidth: '940px',
    }

    return (
      <div style={homePageStyle}>
        {error &&
          <p>Error: {error} </p>
        }
        <UserInfo authUser={authUser} twitterAccount={twitterAccount} {...stats} />
        <Navigation currentTab={currentTab} setCurrentTab={this.setCurrentTab}/>
        {currentTab == ROUTES.HOME &&
            <PhotosTab twitterAccount={twitterAccount} tags={tags} existingTagsList={existingTagsList}/>
        }
        {currentTab == ROUTES.CONTACTS &&
            <ContactsTab authUser={authUser} contacts={contacts} tags={tags} existingTagsList={existingTagsList}/>
        }
      </div>
    );
  }
}


// const condition = authUser => !!authUser;

export default compose(
  // withAuthorization(condition),
  withHeader,
)(Home);
