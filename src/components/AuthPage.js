import React from "react";
import Spinner from "./Spinner";
import axios from "axios";
import * as ROUTES from '../constants/routes';

// import { withAuthorization } from './Session';



class AuthPage extends React.Component {

  constructor(props) {
    super(props);

    this.returnHome = this.returnHome.bind(this);
  }

  //can I store in state instead of localstorage?
  componentDidMount() {
    const { authUser } = this.props;
    const { uid } = authUser;
    const search = this.props.location.search;
    const queryParams = new URLSearchParams(search);

    if (queryParams.get('oauth_token') === localStorage.getItem('oauthRequestToken')) {
      axios
        .post('/linkTwitter', {
          uid: uid,
          oauthRequestToken: localStorage.getItem('oauthRequestToken'),
          oauthRequestTokenSecret: localStorage.getItem('oauthRequestTokenSecret'),
          oauthVerifier: queryParams.get('oauth_verifier'),
        })
        .then((res) => {
          this.returnHome();
        })
        .catch((error) => {
          console.log('error:', error.response);
          console.log('error:', error);
          this.returnHome(error.data ? error.data.error : error.message);
        });
    }
    else if (queryParams.get('denied')) {
      console.log('denied and or canceled twitter auth');
      this.returnHome();
    }
    else {
      const error = 'Request tokens do not match';
      console.log('error:', error);
      this.returnHome(error);
    }
  }

  returnHome(error) {
    this.props.history.push(
      ROUTES.HOME,
      { error },
    );
  }

  render() {

    return (
      <div>
        <Spinner />
      </div>
    );
  }

}

// const condition = authUser => !!authUser;
// export default withAuthorization(condition)(AuthPage);
export default AuthPage;
