import React from 'react';
import spinnerGif from '../assets/img/spinner.gif';

export default () => {

  const backdropStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '3',
    opacity: '0.5',
  }

  const gifStyle = {
    width: '200px',
  }

  return (
    <div style={backdropStyle}>
      <img
        src={spinnerGif}
        style={gifStyle}
        alt="Loading..."
      />
    </div>
  );
};
