import React from 'react';
import { Redirect } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const withAuthorization = condition => Component => {

  class WithAuthorization extends React.Component {
    render() {
      const { authUser } = this.props;

      return (
        <div>
          {
            condition(authUser) ?
            <Component {...this.props} /> :
            <Redirect to={ROUTES.SIGN_IN}/>
          }
        </div>
      );
    }
  };

  return WithAuthorization;
};

export default withAuthorization;
