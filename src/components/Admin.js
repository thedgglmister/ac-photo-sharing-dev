import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from './Firebase';

import * as ROLES from '../constants/roles';


class AdminPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <p>
          Restricted area! Only users with the admin role are authorized.
        </p>
      </div>
    );
  }
}


const condition = authUser =>
  authUser && authUser.roles && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withFirebase,
)(AdminPage);
