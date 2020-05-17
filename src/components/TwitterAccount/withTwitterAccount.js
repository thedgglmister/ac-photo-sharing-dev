import React from 'react';

import { withFirebase } from '../Firebase';
import Spinner from '../Spinner';


const withTwitterAccount = Component => {

  class WithTwitterAccount extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        twitterAccount: null,
      };
    }

    componentDidMount() {

      const { authUser } = this.props;
      const { uid } = authUser;

      this.twitterAccountRef = this.props.firebase.twitterAccount(uid);

      this.twitterAccountRef.on('value', snapshot => {
        const twitterAccount = snapshot.val();
        if (twitterAccount) {
          twitterAccount.uid = authUser.uid;
        }
        this.setState({
          loading: false,
          twitterAccount: twitterAccount,
        });
      });
    }

    componentWillUnmount() {
      this.twitterAccountRef.off();
    }

    render() {
      const { loading, twitterAccount } = this.state;

      return (
        <div>
          {
            loading ?
            <Spinner /> :
            <Component {...this.props} twitterAccount={twitterAccount} />
          }
        </div>
      );
    }
  }

  return withFirebase(WithTwitterAccount);
};

export default withTwitterAccount;
