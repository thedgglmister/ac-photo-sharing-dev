import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../constants/routes';

import missingPhoto from '../assets/img/missingPhoto.png';
import twitterIcon from '../assets/img/twitterIcon.png';




class UserInfo extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {

    const { authUser, twitterAccount, contactsCount, photosCount } = this.props;
    const { username, profilePhotoUrl } = authUser;

    const imgSrc = profilePhotoUrl ? profilePhotoUrl : missingPhoto;

    const userInfoStyle = {
      padding: '60px 0px 40px 0px',
      borderBottom: '1px solid black',
      display: 'flex',
    };

    const photoContainerStyle = {
      padding: '0px 70px',
      marginRight: '30px',
    };

    const photoStyle = {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      cursor: 'pointer',
    };

    const userNameContainerStyle = {
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
    };

    const twitterInfoContainerStyle = {
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'flex-end',
    };

    const userNameStyle = {
      fontSize: '28px',
      marginRight: '20px',
    };

    const statStyle = {
      marginRight: '45px',
    };

    const twitterIconStyle = {
      width: '15px',
      marginRight: '10px',
    };


    const twitterScreenNameStyle = {
      fontSize: '18px',
      marginBottom: '-3px',
    };

    const editProfileButtonStyle = {
      textDecoration: 'none',
      color: 'black',
      border: '1px solid black',
      borderRadius: '4px',
      backgroundColor: '#fff',
      padding: '5px 10px',
    }



    return (
      <div id="user-info" style={userInfoStyle}>
        <div id="user-info-photo-container" style={photoContainerStyle}>
          <Link to={ROUTES.ACCOUNT} >
            <img id="user-info-photo" src={imgSrc} style={photoStyle}/>
          </Link>
        </div>
        <div>
          <div style={userNameContainerStyle}>
            <span style={userNameStyle}>{username}</span>
            <Link to={ROUTES.ACCOUNT} style={editProfileButtonStyle}>
              <div>
                Edit Profile
              </div>
            </Link>
          </div>
          <div>
            {twitterAccount &&
              <div style={twitterInfoContainerStyle}>
                <img src={twitterIcon} style={twitterIconStyle}/>
                <span style={twitterScreenNameStyle} >{twitterAccount.twitterScreenName}</span>
              </div>
            }
          </div>
          <div style={userNameContainerStyle}>
            <span style={statStyle}><strong>{photosCount}</strong> {photosCount == 1 ? 'photo' : 'photos'}</span>
            <span style={statStyle}><strong>{contactsCount}</strong> {contactsCount == 1 ? 'contact' : 'contacts'}</span>
          </div>
        </div>
      </div>
    );
  }
}





export default UserInfo;
