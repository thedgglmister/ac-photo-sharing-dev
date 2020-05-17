import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { compose } from 'recompose';

import { withAuthorization } from './Session';
import { withTwitterAccount } from './TwitterAccount';
import withContacts from './WithContacts';
import withTags from './WithTags';



import AuthPage from "./AuthPage";
import Home from "./Home";
import AccountPage from './Account';
import TagPage from './TagPage';


import * as ROUTES from '../constants/routes';


class AuthArea extends React.Component {

  render() {

    const { authUser, twitterAccount, contacts, tags } = this.props;
    console.log(window.location.pathname);

    return (
      <Router>
        <Switch>
          <Route exact path={ROUTES.AUTH_PAGE} render={(props) => (
            <AuthPage {...props} authUser={authUser} />
          )}/>
          <Route exact path={`(${ROUTES.HOME}|${ROUTES.CONTACTS})`} render={(props) => (
            <Home {...props} authUser={authUser} twitterAccount={twitterAccount} contacts={contacts} tags={tags}/>
          )}/>
          <Route exact path={ROUTES.TAG_PAGE} render={(props) => (
            <TagPage {...props} authUser={authUser} tags={tags}/>
          )}/>
          <Route exact path={ROUTES.ACCOUNT} render={(props) => (
            <AccountPage {...props} authUser={authUser} />
          )}/>
        </Switch>
      </Router>
    );
  }
};


const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withTwitterAccount,
  withContacts,
  withTags
)(AuthArea);
