import React from "react";
import AuthenticationButton from "./authentication-button";

export class AuthNav extends React.Component {
  render() {
    return (
      <div className="navbar-nav ml-auto">
        <AuthenticationButton />
      </div>
    );
  }
}

export default AuthNav;