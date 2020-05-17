import React from 'react';

import Contact from './Contact';
import { withFirebase } from './Firebase';



class ContactsList extends React.Component {

  constructor(props) {
    super(props);

    //this.deleteContact = this.deleteContact.bind(this);
    // this.updateContact = this.updateContact.bind(this);

  }


  // updateContact(contactId, contactUpdates) {
  //   const { firebase, uid } = this.props;
  //
  //   firebase.updateContact(uid, contactId, contactUpdates)
  //     .then(() => {
  //       console.log('contact updated');
  //     })
  //     .catch((error) => {
  //       console.log('error saving contact', error);
  //       this.setState({ error });
  //     });
  // }

  render() {
    const { contacts, uid, existingTagsList, readonly } = this.props;

    //TO DO TODO: make sure contacts are in correct order.
    const contactsList = contacts ? Object.values(contacts) : [];




    console.log(contactsList);

    return (
      <div>
        {
          contactsList.length == 0 &&
          <p>You have no contacts</p>
        }
        {
          contactsList.length > 0 &&
          contactsList.map((contact) =>
            <Contact
              key={contact.contactId}
              contact={contact}
              uid={uid}
              existingTagsList={existingTagsList}
              readonly={readonly}
            />
          )
        }
      </div>
    );
  }
}

export default withFirebase(ContactsList);
