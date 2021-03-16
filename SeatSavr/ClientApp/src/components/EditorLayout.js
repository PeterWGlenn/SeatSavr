
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
            pictures: [],
            layout: null,
            canvasImageDataURL: null,
            loading: true
        }
        this.onDrop = this.onDrop.bind(this);
    }

    componentDidMount() {
        this.populateLayout();
    }

    onDrop = (files) => {

        var canvas = document.getElementById('layoutEditorCanvas');
        var context = canvas.getContext('2d');

        var reader = new FileReader();
        reader.onload = function (event) {
            var img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(files[0]); 

        this.state.canvasImageDataURL = canvas.toDataURL();
    }

    pushToDatabase = () => {
        this.postLayout();
    };

    render() {
        return (
            <div>
                <canvas id="layoutEditorCanvas"/>
                <ImageUploader
                    withIcon={true}
                    label="Accepted file types: .jpg, .gif, .png"
                    buttonText='Upload Layout'
                    onChange={this.onDrop}
                    withPreview={true}
                    imgExtension={['.jpg', '.gif', '.png']}
                    maxFileSize={2000000} />
                <div>
                    <button onClick={() => this.pushToDatabase()}>Push to Database</button>
                </div>
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
            console.log('Request successful', text);
        }).catch(function (error) {                        
            console.log('Request failed', error);
        });
    }
              
}