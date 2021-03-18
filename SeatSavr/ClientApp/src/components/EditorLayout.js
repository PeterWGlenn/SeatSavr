
import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';
import Box from '@material-ui/core/Box';
import { Button } from '@material-ui/core';

import './EditorLayout.css'

export class EditorLayout extends Component {
    static displayName = EditorLayout.name;
    static areaRadius = 12;
    static layoutWidth = 888;
    static layoutHeight = 500;

    constructor(props) {
        super(props);
        this.state = {
            currentAreas: [],
            newAreaLocations: [],
            layout: null,
            canvasImageDataURL: null,
            loading: true
        }
        this.onDrop = this.onDrop.bind(this);
    }

    componentDidMount() {
        this.renderAreas();
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
                thisObject.renderAreas();
            }
            img.src = event.target.result;
        }

        if (files != null && files.length > 0) {
            reader.readAsDataURL(files[0]);
        }
    }

    static convertAreaLocToCanvasLoc(x, y) {
        var xLoc = (x / 100) * EditorLayout.layoutWidth;
        var yLoc = (y / 100) * EditorLayout.layoutHeight;

        return { x: xLoc, y: yLoc };
    }

    static convertCanvasLocToAreaLoc(x, y) {
        var xLoc = (x / EditorLayout.layoutWidth) * 100;
        var yLoc = (y / EditorLayout.layoutHeight) * 100;

        return { x: xLoc, y: yLoc };
    }

    async renderAreas() {

        if (this.state.loading === true) {
            await this.populateLayout();
        }

        var canvas = document.getElementById('layoutEditorCanvas');
        if (canvas != null) {
            var context = canvas.getContext('2d');

            var areas = this.state.currentAreas;
            var newAreaLocs = this.state.newAreaLocations;

            var image = new Image();
            image.onload = function () {
                // Draw Background Image
                context.drawImage(image, 0, 0, EditorLayout.layoutWidth, EditorLayout.layoutHeight);

                // Draw border
                context.lineWidth = 1;
                context.strokeStyle = "#000000";
                context.strokeRect(0, 0, canvas.width, canvas.height);

                // Draw current areas
                areas.forEach(area => {
                    var cLoc = EditorLayout.convertAreaLocToCanvasLoc(area.areaLocation.x, area.areaLocation.y);
                    EditorLayout.drawAreaIcon(context, cLoc.x, cLoc.y, false);
                });

                // Draw new areas
                newAreaLocs.forEach(areaLoc => {
                    var cLoc = EditorLayout.convertAreaLocToCanvasLoc(areaLoc.x, areaLoc.y);
                    EditorLayout.drawAreaIcon(context, cLoc.x, cLoc.y, true);
                });
            };

            if (this.state.canvasImageDataURL != null) {
                image.src = this.state.canvasImageDataURL;
            }
        }
    }

    canvasClick = (e) => {
        var canvasRect = document.getElementById('layoutEditorCanvas').getBoundingClientRect();

        var x = e.clientX - canvasRect.left;
        var y = e.clientY - canvasRect.top;

        var collision = false;

        this.state.currentAreas.forEach((area) => {
            var canLoc = EditorLayout.convertAreaLocToCanvasLoc(area.areaLocation.x, area.areaLocation.y);

            if (EditorLayout.isNumberWithin(x, canLoc.x, EditorLayout.areaRadius * 2) && EditorLayout.isNumberWithin(y, canLoc.y, EditorLayout.areaRadius * 2)) {
                // Can't place areas on other areas
                collision = true;
            }
        });

        this.state.newAreaLocations.forEach((aLoc) => {
            var canLoc = EditorLayout.convertAreaLocToCanvasLoc(aLoc.x, aLoc.y);

            if (EditorLayout.isNumberWithin(x, canLoc.x, EditorLayout.areaRadius * 2) && EditorLayout.isNumberWithin(y, canLoc.y, EditorLayout.areaRadius * 2)) {
                // Can't place areas on other areas
                collision = true;
            } 
        });

        // Add area to areas
        if (!collision) {

            var areaLoc = EditorLayout.convertCanvasLocToAreaLoc(x, y);

            this.state.newAreaLocations.push({
                x: areaLoc.x,
                y: areaLoc.y
            });

            EditorLayout.drawAreaIcon(document.getElementById('layoutEditorCanvas').getContext('2d'), x, y, true);
        }
    }

    static isNumberWithin(x, n, r) {
        return x > (n - r) && x < (n + r);
    }

    static drawAreaIcon(context, x, y, isNew) {
        context.beginPath();
        context.arc(x, y, EditorLayout.areaRadius, 0, 2 * Math.PI, false);

        if (isNew) {
            context.fillStyle = '#34eba8';
        }
        else {
            context.fillStyle = 'green';
        }

        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#000000';
        context.stroke();
    }

    render() {
        return (
            <div>
                <canvas id="layoutEditorCanvas"
                        width={EditorLayout.layoutWidth}
                        height={EditorLayout.layoutHeight}
                        onClick={this.canvasClick}/>
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
                    <Button onClick={this.onSaveLayout} className="form-buttons">Save Layout</Button>
                    <Button onClick={this.onClearEdits} className="form-buttons">Clear Edits</Button>
                </Box>
            </div>
        );

    }

    onSaveLayout = () => {
        this.saveLayout();
    }

    onClearEdits = () => {
        this.clearEdits();
    }

    async saveLayout() {
        await this.postLayout();
        this.renderAreas();
    }

    async clearEdits() {
        await this.setState({ newAreaLocations: [] });
        this.renderAreas();
    }

    async populateLayout() {
        const response = await fetch('editorupload', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const data = await response.json();

        this.setState({
            layout: data,
            currentAreas: data.areas,
            canvasImageDataURL: "data:image/png;base64," + data.layoutImage,
            loading: false
        });
    }

    async postLayout() {

        if (this.state.loading)
            return;

        var layout = this.state.layout;

        await fetch('editorupload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: layout.name,
                address: layout.address,
                layoutImage: this.state.canvasImageDataURL,
                newAreaLocations: this.state.newAreaLocations
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