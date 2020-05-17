import React from 'react';

import ContactsList from './ContactsList';
import NewContactForm from './NewContactForm';
import FilterByTagInput from './FilterByTagInput';


//TODO TO DO should only be aable to edit one contact at a time? can =t add new contact while editing a contact and versa visa.
//TODO TO DO right now, whatever the case of the first time a tag is used is, it sticks. so if i add tag abcd and then remove it so its on no one, and i try to ad ABcd, it still does abcd...


class ContactsTab extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      filterTagId: null,
    };

    this.setFilterTagId = this.setFilterTagId.bind(this);
  }


  setFilterTagId(filterTagId) {
    this.setState({
      filterTagId,
    })
  }



  render() {
    const { error, filterTagId } = this.state;
    const { authUser, contacts, tags, existingTagsList } = this.props;
    const { uid } = authUser;

    let filteredContacts = {};
    if (filterTagId) {
      const tagContacts = tags[filterTagId].contacts;
      for (let contactId in tagContacts){
        filteredContacts[contactId] = contacts[contactId];
      }
    }
    else {
      filteredContacts = contacts;
    }



    return (
      <div>
        <NewContactForm uid={uid} existingTagsList={existingTagsList}/>
        <FilterByTagInput filterTagId={filterTagId} existingTagsList={existingTagsList} setFilterTagId={this.setFilterTagId} />
        <ContactsList uid={uid} contacts={filteredContacts} existingTagsList={existingTagsList} />
      </div>
    );
  }
};


export default ContactsTab;
