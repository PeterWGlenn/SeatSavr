import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Button, TextField } from '@material-ui/core';
import { LayoutEditor } from './LayoutEditor';

export class AdminSelectLayout extends Component {
    static displayName = AdminSelectLayout.name;

    constructor(props) {
        super(props);
        this.state = {
            allLayouts: [],
            displayedLayouts: [],
            loading: true,
            selectedLayout: null
        };
    }

    componentDidMount() {
        this.populateLayoutData();
    }

    async populateLayoutData() {
        var selectedAddress = '123 Main Street, Washington';
        if (selectedAddress == null)
            return false;

        var fetchString = 'adminselectlayout/getlayouts/?address=' + selectedAddress;
        const response = await fetch(fetchString, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const layouts = await response.json();
        this.setState({ allLayouts: layouts, displayedLayouts: layouts, loading: false });
    }

    getListTitleHTML() {
        return (
            <div>
                <h1>Your Layouts</h1>
            </div>
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                    {this.getListTitleHTML()}
                    <h3>Loading layouts...</h3>
                </div>
            );
        }

        if (this.state.selectedLayout == null) {
            return (
                <div>
                    {this.getListTitleHTML()}
                    <TextField
                        id='layoutListFilter'
                        label="Search Layouts"
                        variant="outlined"
                        fullWidth
                        onChange={() => {
                            var newLayouts = [];
                            var filter = document.getElementById('layoutListFilter').value.toLowerCase();

                            this.state.allLayouts.forEach((layout) => {
                                if (layout.address.toLowerCase().includes(filter) || layout.name.toLowerCase().includes(filter)) {
                                    newLayouts.push(layout);
                                }
                            });
                            this.setState({ displayedLayouts: newLayouts });
                        }} />
                    <List id='layoutList'>
                        {this.state.displayedLayouts.map(layout =>
                            <ListItem key={layout.address} button onClick={() => { this.setState({ selectedLayout: layout }); }}>
                                <ListItemText primary={layout.name} secondary={layout.address} />
                            </ListItem>
                        )}
                    </List>
                </div>
            );
        }

        var name = "No layout selected";
        var address = "";
        if (this.state.selectedLayout != null) {
            name = this.state.selectedLayout.name;
            address = this.state.selectedLayout.address;
        }

        return (
            <div>
                <h2>
                    {name}
                    <Button onClick={() => { this.setState({ selectedLayout: null }); }}>(Change Layout)</Button>
                </h2>
                <h5>{address}</h5>
                <LayoutEditor selectedLayoutAddress={this.state.selectedLayout.address} />
            </div>
        );
    }
}
