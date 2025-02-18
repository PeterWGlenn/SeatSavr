﻿import React, { Component } from 'react';
import { SelectArea } from './SelectArea';

import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { TextField } from '@material-ui/core';

import '../custom.css';

export class UserSelectLayout extends Component {
    static displayName = UserSelectLayout.name;

    constructor(props) {
        super(props);
        this.state = {
            allLayouts: [],
            availableLayouts: [],
            loading: true,
            selectedLayout: null
        };
    }

    componentDidMount() {
        this.populateLayoutData();
    }

    async populateLayoutData() {
        const response = await fetch('userselectlayout/getlayouts', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'    
            }
        });

        const layouts = await response.json();
        this.setState({ allLayouts: layouts, availableLayouts: layouts, loading: false });
    }

    getWelcomeHTML() {
        return (
            <div>
                <center>
                    <h1>Welcome to SeatSavr!</h1>
                    <p>SeatSavr manages your reservations in the modern world. Please select a layout below to get started!</p>
                    <p>If you want to create your own layouts, login as an administrator.</p>
                </center>
            </div>
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                    {this.getWelcomeHTML()}
                    <h3>Loading layouts...</h3>
                </div>
            );
        }

        if (this.state.selectedLayout == null) {
            return (
                <div>
                    {this.getWelcomeHTML()}
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
                            this.setState({ availableLayouts: newLayouts });
                        }} />
                    <List id='layoutList'
                        className='button-nav'>
                        {this.state.availableLayouts.map(layout =>
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
                <h1>
                    {name}
                    <Button className='button-nav' onClick={() => { this.setState({ selectedLayout: null, availableLayouts: this.state.allLayouts }); }}>(Change Layout)</Button>
                </h1>
                <h6>{address}</h6>

                <SelectArea selectedLayout={this.state.selectedLayout} />
            </div>
        );
    }
}
