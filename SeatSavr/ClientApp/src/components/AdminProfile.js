import React from "react";
import { withAuth0 } from "@auth0/auth0-react";
import '../custom.css'
class AdminProfile extends React.Component {
    render() {
        const { user } = this.props.auth0;
        const { name, picture, email } = user;

        return (
            <div className="container">
                <div className="main-body">
                   
                    {/* /Breadcrumb */}
                    <div className="row gutters-sm">
                        <div className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <img src={picture} alt="Admin" className="rounded-circle" width={150} />
                                    </div>
                                </div>
                            </div>
                    </div>
                        <div className="col-md-8">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-3" >
                                            <h6 className="mb-0" >Full Name</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {name}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Email</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {email}
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          
        );
    }
}
export default withAuth0(AdminProfile);




