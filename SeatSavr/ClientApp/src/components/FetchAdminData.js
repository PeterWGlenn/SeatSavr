import React, { Component } from 'react';

export class FetchAdminData extends Component {
    static displayName = FetchAdminData.name;

    constructor(props) {
        super(props);
        this.state = { admins: [], loading: true };
    }

    componentDidMount() {
        this.populateAdminData();
    }

    static renderAdminTable(admins) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Privilege</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map(admin =>
                        <tr key={admin.email}>
                            <td>{admin.email}</td>
                            <td>{admin.privilege}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : FetchAdminData.renderAdminTable(this.state.admins);

        return (
            <div>
                <h1 id="tabelLabel" >Admin Data</h1>
                <p>This component demonstrates fetching admin data from the database.</p>
                {contents}
            </div>
        );
    }

    async populateAdminData() {
        const response = await fetch('admindata');
        const data = await response.json();
        this.setState({ admins: data, loading: false });
    }
}
