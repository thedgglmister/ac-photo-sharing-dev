import React from "react";

import AddTagInput from './AddTagInput';
import { withFirebase } from './Firebase';

const INITIAL_STATE = {
  name: '',
  rawPhoneNumber: '',
  tagsList: [],
  error: null,
}


class NewContactForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ...INITIAL_STATE,
    };

    this.onChange = this.onChange.bind(this);
    this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
    this.saveContact = this.saveContact.bind(this);
    this.addTag = this.addTag.bind(this);
  }

  saveContact() {
    const { name, rawPhoneNumber, tagsList } = this.state;
    const { uid, firebase } = this.props;

    const phoneNumber = rawPhoneNumber.replace(/\D/g,'');
    const fullPhoneNumber = `+1${phoneNumber}`;

    const contact = {
      name: name.trim(),
      phoneNumber,
      fullPhoneNumber,
      tagsList,
    };

    firebase.saveContact(uid, contact)
      .then(() => {
        console.log('contact saved');
        this.setState({
          ...INITIAL_STATE,
        });
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        console.log('error saving contact', error);
        //this.setState({ error });
      });
  }

  onChange = function(event) {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  //TODO TO DO need to do all comparisons case insensitive. where else in the whole code base do i need to do this?
  addTag(tagToAdd) {
    const { tagsList } = this.state;

    const updatedTagsList = [].concat(tagsList, [tagToAdd]);

    this.setState({
      tagsList: updatedTagsList,
    });
  }

  removeTag(tagToRemove) {
    const { tagsList } = this.state;
    const updatedTagsList = tagsList.filter((tag) => tag.lc_tagName != tagToRemove.lc_tagName);
    this.setState({
      tagsList: updatedTagsList,
    });
  }

  render() {
    const { error, name, rawPhoneNumber, tagsList } = this.state;
    const { uid, existingTagsList } = this.props;

    const style = {
      margin: '20px',
      padding: '20px',
      border: '1px solid black',
      borderRadius: '5px',
    }

    const isInvalid = name.trim() === '' || rawPhoneNumber.replace(/\D/g,'').length != 10;

    //TODO TO DO need to keep tagValue in state in this component, since we want to reset when save button clicked.
    return (
      <div style={style}>
        <p>New Contact</p>
        {error &&
          <p>Error: {error} </p>
        }

        <input type="text" name="name" value={name} placeholder="Name" onChange={this.onChange}/>
        <br/>
        <input type="tel" name="rawPhoneNumber" value={rawPhoneNumber} placeholder="Phone Number" onChange={this.onChange} />
        <br/>
        <AddTagInput addTag={this.addTag} tagsList={tagsList} existingTagsList={existingTagsList} />
        {tagsList.map((tag) =>
            <div key={tag.tagName}>
              <span>{`#${tag.tagName}`}</span>
              <button onClick={() => this.removeTag(tag)}>Remove</button>
            </div>
        )}
        <br/>
        <button onClick={this.saveContact} disabled={isInvalid}>Save</button>
      </div>
    );
  }
}


export default withFirebase(NewContactForm);
