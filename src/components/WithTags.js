import React from 'react';

import { withFirebase } from './Firebase';
import Spinner from './Spinner';


const withTags = Component => {

  class WithTags extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        tags: null,
      };
    }

    componentDidMount() {

      const { authUser } = this.props;
      const { uid } = authUser;

      this.tagsRef = this.props.firebase.tags(authUser.uid);
      this.tagsRef.on('value', snapshot => {
        const tags = snapshot.val();
        this.setState({
          loading: false,
          tags: tags,
        });
      });
    }

    componentWillUnmount() {
      this.tagsRef.off();
    }








    render() {
      const { loading, tags } = this.state;

      // const existingTagsList = !tags ? [] : Object.values(tags).map(tag => {
      //   delete tag.contacts;
      //   return tag;
      // });

      return (
        <div>
          {
            loading ?
            <Spinner /> :
            <Component {...this.props} tags={tags} />
          }
        </div>
      );
    }
  }

  return withFirebase(WithTags);
};

export default withTags;
