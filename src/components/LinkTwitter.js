import React, { Component } from "react";
import Spinner from "./Spinner";
import axios from "axios";

// import { withAuthorization } from './Session';


class LinkTwitter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
    };

    this.startAuth = this.startAuth.bind(this);
  }

  startAuth() {
    this.setState({
      loading: true,
      error: null,
    });

    axios
      .post("/startAuth")
      .then((res) => {
        if (res.data.redirectUrl) {
          localStorage.setItem(
            "oauthRequestTokenSecret",
            res.data.oauthRequestTokenSecret
          );
          localStorage.setItem(
            "oauthRequestToken",
            res.data.oauthRequestToken
          );
          window.location.href = res.data.redirectUrl;
        }
      })
      .catch((err) => {
        this.setState({
          loading: false,
          error: err,
        });
      });
  };


  render() {
    const { loading } = this.state;


    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }

    const childStyle = {
      padding: '80px 0px 25px 0px',
    }


    return (
      <div style={containerStyle}>
        <div style={childStyle}>Looks like you haven't linked a twitter account yet</div>
        {loading &&
            <Spinner />
        }
        {!loading &&
            <button onClick={this.startAuth}>Link Twitter Account</button>
        }
      </div>
    );
  }
}


export default LinkTwitter;
