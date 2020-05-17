import React from 'react';
import { compose } from 'recompose';


// import { PasswordForgetForm } from './PasswordForget';
// import PasswordChangeForm from './PasswordChange';
// import { withAuthorization } from './Session';
import withHeader from './WithHeader';
import missingPhoto from '../assets/img/missingPhoto.png';





const AccountPage = (props) => {

  const { authUser } = props;
  const { phoneNumber, username, profilePhotoUrl } = authUser;

  const imgSrc = profilePhotoUrl ? profilePhotoUrl : missingPhoto;

  const photoStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    cursor: 'pointer',
  };

  return (
    <div>
      <p>Phone number: {phoneNumber}</p>
      <p>Username: {username}</p>
      <div>
        <img src={imgSrc} style={photoStyle}/>
      </div>

    </div>
  );
};

//const condition = authUser => !!authUser;

export default compose(
  // withAuthorization(condition),
  withHeader,
)(AccountPage);
