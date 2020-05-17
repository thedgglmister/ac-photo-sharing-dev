import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import axios from "axios";


import { SignUpLink } from './SignUp';
import { withForwardUsersHome } from './Session';
import { withFirebase } from './Firebase';

import * as ROUTES from '../constants/routes';

const SignInPage = () => (
  <div>
    <div>SignIn</div>
    <br/>
    <SignInForm />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  rawPhoneNumber: '',
  code: '',
  phoneSubmitted: false,
  codeSubmitted: false,
  confirmationResult: null,
  error: null,
};

class SignInFormBase extends Component {
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
    const { rawPhoneNumber } = this.state;
    const { firebase } = this.props;

    const phoneNumber = rawPhoneNumber.replace(/\D/g,'');
    const fullPhoneNumber = `+1${phoneNumber}`;

    const recaptchaVerifier = this.recaptchaVerifier;

    this.setState({
      error: null,
      phoneSubmitted: true,
    });

    try {
      const { data } = await axios.post("/userAlreadyExists", {
        phoneNumber,
      });
      if (!data.phoneNumberMatch) {
        throw new Error('A user with this phone number does not exists');
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
    const { code, confirmationResult } = this.state;

    this.setState({
      error: null,
      codeSubmitted: true,
    });

    confirmationResult.confirm(code)
      .then((authUser) => {
        console.log('in confirmation result. aout to push home route.')
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

  render() {
    const { rawPhoneNumber, code, confirmationResult, phoneSubmitted, codeSubmitted, error } = this.state;

    const phoneInvalid = rawPhoneNumber.replace(/\D/g,'').length != 10;
    const codeInvalid = code === '';

    return (
      <div>
        {!confirmationResult &&
          <div>
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
            <button disabled={phoneInvalid || phoneSubmitted} onClick={this.submitPhoneNumber}>
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

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

const condition = authUser => !!authUser;
export default withForwardUsersHome(condition)(SignInPage);

export { SignInForm };
