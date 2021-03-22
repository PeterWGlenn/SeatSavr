import React, { Component } from 'react';

export class TestingDeploymentFetch extends Component {
    static displayName = TestingDeploymentFetch.name;

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            admins: [],
            loading: true
        };
    }

    componentDidMount() {
        this.populateData();
        this.populateAdminData();
    }

    async populateData() {
        const response = await fetch('testdeploymentfetch', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const dataObj = await response.json();
        this.setState({ data: dataObj });
    }

    async populateAdminData() {
        const response = await fetch('admindata', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const dataObj = await response.json();
        this.setState({ admins: dataObj, loading: false});
    }

    render() {

        if (this.state.loading) {
            return (
                <div>
                    <h3>LOADING!</h3>
                </div>
                );
        }

        return (
            <div>
                <h3>Testing this!</h3>
                <h1>{this.state.data.number}</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.admins.map(admin =>
                            <tr key={admin.email}>
                                <td>{admin.email}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}
