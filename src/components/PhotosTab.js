import React from 'react';

import PhotosList from './PhotosList';
import LinkTwitter from './LinkTwitter';
import FilterByTagInput from './FilterByTagInput';



class PhotosTab extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filterTagId: null,
    }

    this.setFilterTagId = this.setFilterTagId.bind(this);
  }

  setFilterTagId(filterTagId) {
    this.setState({
      filterTagId,
    })
  }




  render() {
    const { filterTagId } = this.state;
    const { twitterAccount, tags, existingTagsList } = this.props;
    const uid = twitterAccount ? twitterAccount.uid : null

    const imageUrlsByTweetId = Object.assign({}, twitterAccount.imageUrlsByTweetId);

    const photos = {};
    //TO DO TODO: make sure photos are in correct order.
    for (let tweetId in imageUrlsByTweetId) {
      Object.assign(photos, imageUrlsByTweetId[tweetId]);
    }

    let filteredPhotos = {};
    if (filterTagId) {
      const tagPhotos = tags[filterTagId].photos;
      for (let photoId in tagPhotos){
        filteredPhotos[photoId] = photos[photoId];
      }
    }
    else {
      filteredPhotos = photos;
    }





    return (
      <div>
        {twitterAccount &&
            <div>
              <FilterByTagInput filterTagId={filterTagId} existingTagsList={existingTagsList} setFilterTagId={this.setFilterTagId} />
              <PhotosList photos={filteredPhotos} uid={uid} />
            </div>
        }
        {!twitterAccount &&
            <LinkTwitter />
        }
      </div>
    );
  }
};


export default PhotosTab;
