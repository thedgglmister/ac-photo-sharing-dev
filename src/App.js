import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';

import './App.css';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AuthArea from './components/AuthArea'
// import AuthPage from "./components/AuthPage";
// import Home from "./components/Home";
// import AccountPage from './components/Account';


//TO DO TODO refactor database shape based on needs of the methods fetching data.
//for example, need to get uid and other user info, so should just have a ref
//that has user info under twitter? need to make sure i update things in all places.

//TODO TO DO manage opt-out / opt-in.



//TO DO TODO need to handle what should happen if they revoke twitter access, for example. or if for any reason linkage stops but its still in database. probably need a way to disconnect within my app.
import * as ROUTES from './constants/routes';
import { withAuthentication } from './components/Session';
import { withTwitterAccount } from './components/TwitterAccount';
import withContacts from './components/WithContacts';


class App extends Component {

  constructor(props) {
    super(props);

    this.intervalDuration = 50;
    this.saveRgbDuration = 5000;
    this.initialRgb = [180, 80, 100];

    this.changeBackgroundColor = this.changeBackgroundColor.bind(this);
    this.saveRgbToLocalStorage = this.saveRgbToLocalStorage.bind(this);
  }


  componentDidMount() {
    document.body.style.transition = `background-color ${this.intervalDuration}ms linear`;
    const prevRgb = localStorage.getItem('rgb');
    this.rgb = prevRgb ? JSON.parse(prevRgb) : this.initialRgb;
    this.changeColorIntervalId = setInterval(this.changeBackgroundColor, this.intervalDuration);
    this.saveColorIntervalId = setInterval(this.saveRgbToLocalStorage, this.saveRgbDuration);
  }


  componentWillUnmount() {
    clearInterval(this.changeColorIntervalId);
    clearInterval(this.saveColorIntervalId);

  }


  changeBackgroundColor() {
    const el = document.body;
    const index = Math.floor(Math.random() * 3);
    const increment = 2;
    let plusOrMinus = Math.round(Math.random()) * 2 - 1;

    const newValue = this.rgb[index] + (increment * plusOrMinus);
    if (newValue > 256) {
      plusOrMinus = -1;
    }
    else if (newValue < 0) {
      plusOrMinus = 1;
    }

    this.rgb[index] += increment * plusOrMinus;
    el.style.backgroundColor = `rgb(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]})`;
  }


  saveRgbToLocalStorage() {
    localStorage.setItem('rgb', JSON.stringify(this.rgb));
  }


  render() {

    const { authUser } = this.props;

    console.log('about to render App');
    console.log(window.location.pathname);
    console.log('authUser', authUser);


    const pageStyle = {
      padding: '77px 25px 0px 25px',
    }




    return (
      <div id="app-container">

        <Router>
          <div id="page-container" style={pageStyle}>
            <Switch>
              <Route exact path={ROUTES.SIGN_IN} render={(props) => (
                <SignIn {...props} authUser={authUser} />
              )}/>
              <Route exact path={ROUTES.SIGN_UP} render={(props) => (
                <SignUp {...props} authUser={authUser} />
              )}/>
              <Route exact path={`(${ROUTES.HOME}|${ROUTES.CONTACTS}|${ROUTES.AUTH_PAGE}|${ROUTES.ACCOUNT})`} render={(props) => (
                <AuthArea {...props} authUser={authUser}/>
              )}/>
              <Route exact path={ROUTES.TAG_PAGE} render={(props) => (
                <AuthArea {...props} authUser={authUser}/>
              )}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}


export default compose(
  withAuthentication,
)(App);
