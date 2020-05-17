import React from 'react';

import { withFirebase } from '../Firebase';
import Spinner from '../Spinner';


const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        authUser: null,
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          this.setState({
            loading: false,
            authUser: authUser,
          });
        },
        () => {
          this.setState({
            loading: false,
            authUser: null,
          });
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {

      const { loading, authUser } = this.state;

      return (
        <div>
          {
            loading ?
            <Spinner /> :
            <Component {...this.props} authUser={authUser} />
          }
        </div>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
