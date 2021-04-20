import React from "react";
import { withAuth0 } from "@auth0/auth0-react";
import "../custom.css"

class LoginButton extends React.Component {
    render() {
        const { loginWithRedirect } = this.props.auth0;

        return (
            <button
                className="btn btn-primary btn-block"
                onClick={() => loginWithRedirect()}
                backgroundColor= "btn-primary"
            >
                Log In
            </button>
        );
    }
}

export default withAuth0(LoginButton);