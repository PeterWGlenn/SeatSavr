
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
            <><ImageUploader
                withIcon={true}
                label="Accepted file types: .jpg, .gif, .png"
                buttonText='Upload Layout'
                onChange={this.onDrop}
                withPreview={true}
                imgExtension={['.jpg', '.gif', '.png']}
                maxFileSize={2000000} />
                <div>
                    <button onClick={() => this.state.postLayoutImage()}>Push to Database</button>
                </div>
             </>
        );

    }

    async postLayoutImage() {
        await fetch('selectarea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                firstName: firstName,
                lastName: lastName,
                duration: duration,
                date: dateString,
                areaLocX: areaX,
                areaLocY: areaY
            })
        });
        this.renderAreas();
    }
              
}