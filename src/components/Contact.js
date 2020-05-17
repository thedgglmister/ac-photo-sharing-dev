import React from 'react';

import { withFirebase } from './Firebase';
import EditContact from './EditContact';
import ViewContact from './ViewContact';


class Contact extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      editing: false,

    };

    this.updateContact = this.updateContact.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.deleteContact = this.deleteContact.bind(this);

    this.deleteTag = this.deleteTag.bind(this);
  }


  deleteTag(tagToRemove) {
    const { firebase, contact, uid } = this.props;
    const { contactId } = contact;


    firebase.deleteTag(uid, contactId, tagToRemove.tagId)
      .then(() => {
        console.log('tag deleted');
      })
      .catch((error) => {
        console.log('error deleting tag', error);
        //TODO TO DO deal with error somewhere. need to go through app and handle all errors.
        //this.setState({ error });
      });


  }








  updateContact(contactUpdates) {

    const { firebase, uid } = this.props;

    firebase.updateContact(uid, contactUpdates)
      .then(() => {
        console.log('contact updated');
        this.setState({
          editing: false,
        });
      })
      .catch((error) => {
        console.log('error saving contact', error);
        this.setState({ error });
      });
  }

  toggleEditMode() {
    const { editing } = this.state;
    this.setState({
      editing: !editing,
    });
  }

  deleteContact() {
    const { firebase, uid, contact } = this.props;
    const { contactId } = contact;

    firebase.deleteContact(uid, contactId)
      .then(() => {
        console.log('contact deleted');
      })
      .catch((error) => {
        console.log('error deleting contact', error);
        //TO DO TODO error?
        //this.setState({ error });
      });
  }



  render() {
    const { editing } = this.state;
    const { contact, existingTagsList, readonly } = this.props;


    const style = {
      margin: '20px',
      padding: '20px',
      border: '1px solid black',
      borderRadius: '5px',
    }


    return (
      <div style={style} >
        {
          editing ?
          <EditContact contact={contact} existingTagsList={existingTagsList} toggleEditMode={this.toggleEditMode} updateContact={this.updateContact} /> :
          <ViewContact contact={contact} readonly={readonly} toggleEditMode={this.toggleEditMode} deleteContact={this.deleteContact} deleteTag={this.deleteTag} />
        }
      </div>
    );
  }
}




export default withFirebase(Contact);
