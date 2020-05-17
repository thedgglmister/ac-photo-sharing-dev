import React from 'react';
import { Link } from 'react-router-dom';

class Photo extends React.Component {

  constructor(props) {
    super(props);

    this.handleDeletePhoto =  this.handleDeletePhoto.bind(this);
  }

  handleDeletePhoto() {
    console.log(899);
    const { photo, deletePhoto } = this.props;
    const { tweetId, photoId } = photo;

    deletePhoto(tweetId, photoId);
  }

  render() {
    const { photo } = this.props;
    const { url, tags } = photo;

    const tagsList = tags ? Object.values(tags) : [];

    const style = {
      padding: '20px',
      boxSizing: 'border-box',
      width: '50%',
    }

    const imgStyle = {
      width: '100%',
    };

    return (
      <div style={style}>
        <button onClick={this.handleDeletePhoto}>Delete</button>
        <br/>
        <img src={url} style={imgStyle} />
        {tagsList.map((tag) =>
          <div key={tag.tagId}>
            <Link to={`/tag/${tag.tagId}`}>
              {`#${tag.tagName}`}
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default Photo;
