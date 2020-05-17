import React from 'react';

import AddTagInput from './AddTagInput';


class EditContact extends React.Component {

  constructor(props) {
    super(props);

    const { contact } = props;
    const { name, phoneNumber, tags } = contact;
    const tagsList = tags ? Object.values(tags) : [];
    const tagsToDeleteList = [];
    const rawPhoneNumber = phoneNumber;

    this.state = {
      contact,
      name,
      rawPhoneNumber,
      tagsList,
      tagsToDeleteList,
    };

    this.onChange = this.onChange.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.addTag = this.addTag.bind(this);
    this.handleUpdateClicked = this.handleUpdateClicked.bind(this);
  }



  static getDerivedStateFromProps(nextProps, prevState) {

    if (nextProps.contact != prevState.contact) {
      const { contact } = nextProps;
      const { name, phoneNumber, tags } = contact;
      const tagsList = tags ? Object.values(tags) : [];
      const tagsToDeleteList = [];
      const rawPhoneNumber = phoneNumber;

      return {
        contact,
        name,
        rawPhoneNumber,
        tagsList,
        tagsToDeleteList,
      };
    }

    // Return null if the state hasn't changed
    return null;
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  removeTag(tagToRemove) {
    const { contact } = this.props;
    const { tags } = contact;
    const { tagsList, tagsToDeleteList } = this.state;

    const updatedTagsList = tagsList.filter((tag) => tag.lc_tagName != tagToRemove.lc_tagName);
    const updatedTagsToDeleteList = [].concat(tagsToDeleteList, tags[tagToRemove.tagId] ? [tagToRemove] : []);

    this.setState({
      tagsList: updatedTagsList,
      tagsToDeleteList: updatedTagsToDeleteList,
    });
  }

  //TODO TO DO need to do all comparisons case insensitive. where else in the whole code base do i need to do this?
  addTag(tagToAdd) {
    const { tagsList, tagsToDeleteList } = this.state;

    const updatedTagsList = [].concat(tagsList, [tagToAdd]);
    const updatedTagsToDeleteList = tagsToDeleteList.filter((tag) => (tag.lc_tagName != tagToAdd.lc_tagName));


    this.setState({
      tagsList: updatedTagsList,
      tagsToDeleteList: updatedTagsToDeleteList,
    });
  }


  handleUpdateClicked() {
    const { updateContact } = this.props;
    const { contact, name, rawPhoneNumber, tagsList, tagsToDeleteList } = this.state;
    const { contactId } = contact;

    const phoneNumber = rawPhoneNumber.replace(/\D/g,'');
    const fullPhoneNumber = `+1${phoneNumber}`;

    const contactUpdates = {
      contactId,
      phoneNumber,
      fullPhoneNumber,
      name: name.trim(),
      tagsList,
      tagsToDeleteList,
    };

    console.log(8733);
    console.log(contactUpdates);

    updateContact(contactUpdates);
  }



  render() {
    const { toggleEditMode, existingTagsList } = this.props;
    const { name, rawPhoneNumber, tagsList, tagsToDeleteList } = this.state;

    const isInvalid = name.trim() === '' || rawPhoneNumber.replace(/\D/g,'').length != 10;

    return (
      <div>
        <input type="text" name="name" value={name} onChange={this.onChange} />
        <br/>
        <input type="text" name="rawPhoneNumber" value={rawPhoneNumber} onChange={this.onChange} />
        <AddTagInput addTag={this.addTag} tagsList={tagsList} existingTagsList={existingTagsList} />
        {tagsList.map((tag) =>
          <div key={tag.tagName}>
            <span>{`#${tag.tagName}`}</span>
            <button onClick={() => this.removeTag(tag)}>Remove</button>
          </div>
        )}
        <br/>
        <button onClick={this.handleUpdateClicked} disabled={isInvalid}>Save</button>
        <button onClick={toggleEditMode}>Cancel</button>
      </div>
    );
  }
}

export default EditContact;
