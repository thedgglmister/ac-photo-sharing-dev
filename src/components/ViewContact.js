import React from 'react';
import { Link } from 'react-router-dom';

class ViewContact extends React.Component {

  render() {
    const { toggleEditMode, deleteContact, deleteTag, contact, readonly } = this.props;
    const { name, phoneNumber, tags } = contact;

    const tagsList = tags ? Object.values(tags) : [];


    return (
      <div>
        {!readonly &&
          <div>
            <button onClick={deleteContact}>Delete</button>
            <button onClick={toggleEditMode}>Edit</button>
          </div>
        }
        <br/>
        <p>Name: {name}</p>
        <p>Phone Number: {phoneNumber}</p>
        {tagsList.map((tag) =>
          <div key={tag.tagId}>
            <Link to={`/tag/${tag.tagId}`}>
              {`#${tag.tagName}`}
            </Link>
            {!readonly &&
              <button onClick={() => deleteTag(tag)}>Remove</button>
            }
          </div>
        )}
      </div>
    );
  }
}



export default ViewContact;
