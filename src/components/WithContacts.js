import React from 'react';

import { withFirebase } from './Firebase';
import Spinner from './Spinner';


const withContacts = Component => {

  class WithContacts extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        contacts: null,
      };
    }

    componentDidMount() {

      const { authUser } = this.props;
      const { uid } = authUser;

      this.contactsRef = this.props.firebase.contacts(authUser.uid);
      this.contactsRef.on('value', snapshot => {
        const contacts = snapshot.val();
        this.setState({
          loading: false,
          contacts: contacts,
        });
      });
    }

    componentWillUnmount() {
      this.contactsRef.off();
    }








    render() {
      const { loading, contacts } = this.state;

      return (
        <div>
          {
            loading ?
            <Spinner /> :
            <Component {...this.props} contacts={contacts} />
          }
        </div>
      );
    }
  }

  return withFirebase(WithContacts);
};

export default withContacts;
