
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import ImageUploader from 'react-images-upload';
import './EditorLayout.css'




export class EditorLayout extends Component {
    static displayName = EditorLayout.name;
    static areaRadius = 12;

    constructor(props) {
        super(props);
        this.state = {
            pictures: []
        }
        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(picture) {
        this.setState({
            pictures: this.state.pictures.concat(picture),
        });
    }

    render() {
        return (
            <ImageUploader
                withIcon={true}
                buttonText='Choose images'
                onChange={this.onDrop}
                imgExtension={['.jpg', '.gif', '.png']}
                maxFileSize={5242880}
            />
        );

    }
              
}