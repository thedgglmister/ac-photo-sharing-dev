import React, { Component } from 'react';
import { compose } from 'recompose';

import ContactsList from './ContactsList';
import PhotosList from './PhotosList';

import withHeader from './WithHeader';


class TagPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);

    const { authUser, tags, match } = this.props;
    const { uid } = authUser;
    const { tagId } = match.params;
    const tag = tags[tagId];
    const contacts = tag ? tag.contacts : null;
    const photos = tag ? tag.photos : null;
    console.log('contacts', contacts);
    console.log('tag', tag);
    console.log('tag', tag);



    const tagPageStyle = {
      margin: 'auto',
      maxWidth: '940px',
    }



    return (
      <div style={tagPageStyle}>
        {!tag &&
          <div>Tag does not exist</div>
        }
        {tag &&
          <div>
            <h1>{tag.tagName}</h1>
            <div>Photos</div>
            <PhotosList photos={photos} uid={uid} />
            <div>Contacts</div>
            <ContactsList contacts={contacts} readonly={true} />
          </div>
        }
      </div>
    );
  }
}


export default compose(
  withHeader,
)(TagPage);
