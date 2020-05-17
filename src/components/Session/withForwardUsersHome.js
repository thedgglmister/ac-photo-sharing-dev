import React from 'react';
import { Redirect } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';



const withForwardUsersHome = condition => Component => {

  class WithForwardUsersHome extends React.Component {
    render() {
      const { authUser } = this.props;

      return (
        <div>
          {
            condition(authUser) ?
            <Redirect to={ROUTES.HOME} /> :
            <Component {...this.props} />
          }
        </div>
      );
    }
  }

  return WithForwardUsersHome;
};

export default withForwardUsersHome;
