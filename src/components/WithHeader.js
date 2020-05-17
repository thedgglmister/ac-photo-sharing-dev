import React from 'react';

import Header from './Header';

const withHeader = Component => {

  class WithHeader extends React.Component {
    render() {
      return (
        <div>
          <Header />
          <Component {...this.props} />
        </div>
      );
    }
  }

  return WithHeader;
};

export default withHeader;
