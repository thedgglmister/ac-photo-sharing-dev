import React from 'react';

import Photo from './Photo';
import { withFirebase } from './Firebase';


class PhotosList extends React.Component {

  constructor(props) {
    super(props);

    this.deletePhoto = this.deletePhoto.bind(this);
  }

  deletePhoto(tweetId, photoId) {
    const { firebase, twitterAccount, uid } = this.props;

    firebase.deletePhoto(uid, tweetId, photoId)
      .then(() => {
        console.log('photo delete successful');
      })
      .catch((error) => {
        console.log('Error deleting photo:', error.response);
        console.log('Error deleting photo:', error);
      });
  }

  render() {
    const { photos } = this.props;

    const photosList = photos ? Object.values(photos) : [];
    console.log('photosList', photosList);

    const photosContainerStyle = {
      display: 'flex',
      flexWrap: 'wrap',
    }

    const noPhotosStyle = {
      display: 'flex',
      justifyContent: 'center',
      fontSize: '24px',
      paddingTop: '80px',
    }


    return (
      <div>
        {photosList.length == 0 &&
            <p style={noPhotosStyle}>You have no photos</p>
        }
        <div style={photosContainerStyle}>
          {photosList.map((photo) =>
            <Photo
              key={photo.photoId}
              photo={photo}
              deletePhoto={this.deletePhoto}
            />
          )}
        </div>
      </div>
    );
  }
}

export default withFirebase(PhotosList);
