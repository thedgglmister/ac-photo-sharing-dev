import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import axios from "axios";


import { withForwardUsersHome } from './Session';
import { withFirebase } from './Firebase';
import * as ROUTES from '../constants/routes';
import * as ROLES from '../constants/roles';

const SignUpPage = () => (
  <div>
    <div>SignUp</div>
    <br/>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  rawPhoneNumber: '',
  code: '',
  phoneSubmitted: false,
  codeSubmitted: false,
  confirmationResult: null,
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.submitPhoneNumber = this.submitPhoneNumber.bind(this);
    this.submitVerificationCode = this.submitVerificationCode.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.recaptchaVerifier = new this.props.firebase.RecaptchaVerifier(
      'recaptcha-container',
      {
        'size': 'invisible',
        //'size': 'normal',
        'callback': (response) => {
          console.log('captcha solved', response);
        },
        'expired-callback': () => {
          console.log('captcha expired');
        }
      }
    );
  }

  submitPhoneNumber = async () => {
    const { rawPhoneNumber, username } = this.state;
    const { firebase } = this.props;
    const recaptchaVerifier = this.recaptchaVerifier;

    const phoneNumber = rawPhoneNumber.replace(/\D/g,'');
    const fullPhoneNumber = `+1${phoneNumber}`;

    this.setState({
      error: null,
      phoneSubmitted: true,
    });

    try {
      const { data } = await axios.post("/userAlreadyExists", {
        phoneNumber,
        username,
      });
      console.log('data', data);
      if (data.phoneNumberMatch) {
        throw new Error('A user with this phone number already exists');
      }
      else if (data.usernameMatch) {
        throw new Error('A user with this username already exists');
      }
    }
    catch (error) {
      console.log(error);
      this.setState({
        error: error,
        phoneSubmitted: false,
      });
      return;
    }

    firebase.doSignInWithPhoneNumber(fullPhoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        console.log('confirmationResult', confirmationResult);
        this.setState({
          confirmationResult,
        });
      })
      .catch((error) => {
        this.setState({
          error: error,
          phoneSubmitted: false,
        });
      });
  };


  submitVerificationCode = () => {
    const { rawPhoneNumber, username, isAdmin, code, confirmationResult } = this.state;
    const lc_username = username ? username.toLowerCase() : username;

    const phoneNumber = rawPhoneNumber.replace(/\D/g,'');
    const fullPhoneNumber = `+1${phoneNumber}`;

    const roles = {};
    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }

    this.setState({
      error: null,
      codeSubmitted: true,
    });

    confirmationResult.confirm(code)
      .then((authUser) => {
        // Create a user in realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            lc_username,
            phoneNumber,
            fullPhoneNumber,
            roles,
          });
      })
      .then((authUser) => {
        console.log(authUser);
        //this.setState({ ...INITIAL_STATE });
        //this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        this.setState({
          error: error,
          codeSubmitted: false,
        });
      });
  };

  onChange = function(event) {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      rawPhoneNumber,
      code,
      isAdmin,
      confirmationResult,
      phoneSubmitted,
      codeSubmitted,
      error,
    } = this.state;

    const phoneInvalid = rawPhoneNumber.replace(/\D/g,'').length != 10;
    const usernameInvalid = !(/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(username));
    const codeInvalid = code === '';

    return (
      <div>
        {!confirmationResult &&
          <div>
            <input
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="Username"
              disabled={phoneSubmitted}
            />
            <br/>
            <input
              name="rawPhoneNumber"
              value={rawPhoneNumber}
              onChange={this.onChange}
              type="tel"
              placeholder="(555)-555-5555"
              disabled={phoneSubmitted}
            />
            <br/>
            <br/>
            <button disabled={phoneInvalid || usernameInvalid || phoneSubmitted} onClick={this.submitPhoneNumber}>
              SEND CODE
            </button>
            {phoneSubmitted &&
              <div>
                Texting verification code...
              </div>
            }
          </div>
        }
        {confirmationResult &&
          <div>
            <input
              name="code"
              value={code}
              onChange={this.onChange}
              type="text"
              placeholder="Enter Verification Code"
              disabled={codeSubmitted}
            />
            <br/>
            <br/>
            <button disabled={codeInvalid || codeSubmitted} onClick={this.submitVerificationCode}>
              ENTER CODE
            </button>
            {codeSubmitted &&
              <div>
                Verifying code...
              </div>
            }
          </div>
        }

        <div id="recaptcha-container"></div>

        {error && <p>{error.message}</p>}
      </div>
    );

  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

const condition = authUser => !!authUser;
export default withForwardUsersHome(condition)(SignUpPage);


export { SignUpForm, SignUpLink };
