
import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';
import Box from '@material-ui/core/Box';

import './EditorLayout.css'

export class EditorLayout extends Component {
    static displayName = EditorLayout.name;
    static areaRadius = 12;
    static layoutWidth = 888;
    static layoutHeight = 500;

    constructor(props) {
        super(props);
        this.state = {
            pictures: [],
            layout: null,
            canvasImageDataURL: null,
            loading: true
        }
        this.onDrop = this.onDrop.bind(this);
    }

    componentDidMount() {
        this.populateLayout();

        var canvas = document.getElementById('layoutEditorCanvas');
        var context = canvas.getContext('2d');

        // Draw border
        context.lineWidth = 1;
        context.strokeStyle = "#000000";
        context.strokeRect(0, 0, canvas.width, canvas.height);
    }

    onDrop = (files) => {

        var canvas = document.getElementById('layoutEditorCanvas');
        var context = canvas.getContext('2d');

        var thisObject = this;

        var reader = new FileReader();
        reader.onload = function (event) {
            var img = new Image();
            img.onload = function () {
                context.drawImage(img, 0, 0, EditorLayout.layoutWidth, EditorLayout.layoutHeight);

                thisObject.state.canvasImageDataURL = canvas.toDataURL();
                thisObject.postLayout();
            }
            img.src = event.target.result;
        }

        if (files != null && files.length > 0) {
            reader.readAsDataURL(files[0]);
        }
    }

    render() {
        return (
            <div>
                <canvas id="layoutEditorCanvas" width={EditorLayout.layoutWidth} height={EditorLayout.layoutHeight} />
                <Box maxWidth={EditorLayout.layoutWidth}>
                    <ImageUploader
                        width={EditorLayout.layoutWidth}
                        withIcon={false}
                        label="Accepted file types: .jpg, .gif, .png"
                        buttonText='Upload Layout Background'
                        onChange={this.onDrop}
                        withPreview={false}
                        imgExtension={['.jpg', '.gif', '.png']}
                        maxFileSize={2000000}
                        singleImage={true} />
                </Box>
            </div>
        );

    }

    async populateLayout() {
        const response = await fetch('editorupload');
        const data = await response.json();
        this.setState({ layout: data, loading: false });
    }

    async postLayout() {

        if (this.state.loading)
            return;

        var layout = this.state.layout;

        await fetch('editorupload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: layout.name,
                address: layout.address,
                layoutImage: this.state.canvasImageDataURL
            })
        }).then(function (response) {                      
            if (response.ok) {
                return response.text();
            }
            throw new Error('Something went wrong.');
        }).then(function (text) {                         
            //console.log('Request successful', text);
        }).catch(function (error) {                        
            console.log('Request failed', error);
        });
    }
              
}