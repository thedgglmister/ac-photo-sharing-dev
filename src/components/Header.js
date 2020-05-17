import React from 'react';

import SignOutButton from './SignOut';


class Header extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {

    const headerStyle = {
      height: '77px',
      width: '100vw',
      position: 'fixed',
      top: '0',
      left: '0',
      borderBottom: '1px solid black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      zIndex: '4',
    };

    const headerContentStyle = {
      width: '100vw',
      maxWidth: '940px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0px 25px',
    };

    const appNameStyle = {
      fontSize: '24px',
      cursor: 'pointer',
    };

    const iconsContainerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    const iconStyle = {
      marginLeft: '20px',
      cursor: 'pointer',
    };

    return (
      <div id="header" style={headerStyle}>
        <div id="header-content" style={headerContentStyle}>
          <div id="header-app-name" style={appNameStyle}>
            Name of App
          </div>
          <div id="header-icons-container" style={iconsContainerStyle} >
            <div class="header-icon" style={iconStyle}>
              Notifications
            </div>
            <div style={iconStyle}>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    );
  }
}





export default Header;
