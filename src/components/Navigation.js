import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../constants/routes';

class Navigation extends React.Component {


  constructor(props) {
    super(props);

  }




  render() {

    const { currentTab, setCurrentTab } = this.props;

    const containerStyle = {
      display: 'flex',
      justifyContent: 'center',
    }

    const linkStyle = {
      margin: '-1px 35px 0px 35px',
      padding: '20px 0px',
      textDecoration: 'none',
      color: 'black',
      zIndex: 2,

    }

    const currentLinkStyle = Object.assign({}, linkStyle, {
      borderTop: '1px solid red',
    });




    return (
      <div style={containerStyle}>
        <Link to={ROUTES.HOME}
            style={currentTab == ROUTES.HOME ? currentLinkStyle : linkStyle}
            onClick={() => setCurrentTab(ROUTES.HOME)}>
          Photos
        </Link>
        <Link to={ROUTES.CONTACTS}
            style={currentTab == ROUTES.CONTACTS ? currentLinkStyle : linkStyle}
            onClick={() => setCurrentTab(ROUTES.CONTACTS)}>
          Contacts
        </Link>
      </div>
    );
  }
};

export default Navigation;
