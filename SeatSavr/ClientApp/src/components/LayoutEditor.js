
import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';
import Box from '@material-ui/core/Box';
import { Button } from '@material-ui/core';

import './LayoutEditor.css'

export class LayoutEditor extends Component {
    static displayName = LayoutEditor.name;
    static areaRadius = 16;
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
                context.drawImage(img, 0, 0, LayoutEditor.layoutWidth, LayoutEditor.layoutHeight);

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
        var xLoc = (x / 100) * LayoutEditor.layoutWidth;
        var yLoc = (y / 100) * LayoutEditor.layoutHeight;

        return { x: xLoc, y: yLoc };
    }

    static convertCanvasLocToAreaLoc(x, y) {
        var xLoc = (x / LayoutEditor.layoutWidth) * 100;
        var yLoc = (y / LayoutEditor.layoutHeight) * 100;

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
                context.drawImage(image, 0, 0, LayoutEditor.layoutWidth, LayoutEditor.layoutHeight);

                // Draw border
                context.lineWidth = 1;
                context.strokeStyle = "#000000";
                context.strokeRect(0, 0, canvas.width, canvas.height);

                // Draw current areas
                areas.forEach(area => {
                    var cLoc = LayoutEditor.convertAreaLocToCanvasLoc(area.areaLocation.x, area.areaLocation.y);
                    LayoutEditor.drawAreaIcon(context, cLoc.x, cLoc.y, false);
                });

                // Draw new areas
                newAreaLocs.forEach(areaLoc => {
                    var cLoc = LayoutEditor.convertAreaLocToCanvasLoc(areaLoc.x, areaLoc.y);
                    LayoutEditor.drawAreaIcon(context, cLoc.x, cLoc.y, true);
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
            var canLoc = LayoutEditor.convertAreaLocToCanvasLoc(area.areaLocation.x, area.areaLocation.y);

            if (LayoutEditor.isNumberWithin(x, canLoc.x, LayoutEditor.areaRadius * 2) && LayoutEditor.isNumberWithin(y, canLoc.y, LayoutEditor.areaRadius * 2)) {
                // Can't place areas on other areas
                collision = true;
            }
        });

        this.state.newAreaLocations.forEach((aLoc) => {
            var canLoc = LayoutEditor.convertAreaLocToCanvasLoc(aLoc.x, aLoc.y);

            if (LayoutEditor.isNumberWithin(x, canLoc.x, LayoutEditor.areaRadius * 2) && LayoutEditor.isNumberWithin(y, canLoc.y, LayoutEditor.areaRadius * 2)) {
                // Can't place areas on other areas
                collision = true;
            } 
        });

        // Add area to areas
        if (!collision) {

            var areaLoc = LayoutEditor.convertCanvasLocToAreaLoc(x, y);

            this.state.newAreaLocations.push({
                x: areaLoc.x,
                y: areaLoc.y
            });

            LayoutEditor.drawAreaIcon(document.getElementById('layoutEditorCanvas').getContext('2d'), x, y, true);
        }
    }

    static isNumberWithin(x, n, r) {
        return x > (n - r) && x < (n + r);
    }

    static drawAreaIcon(context, x, y, isNew) {
        context.beginPath();
        context.arc(x, y, LayoutEditor.areaRadius, 0, 2 * Math.PI, false);

        if (isNew) {
            context.fillStyle = 'rgba(52, 235, 168, 0.75)';
        }
        else {
            context.fillStyle = 'rgba(0, 100, 0, 0.75)';
        }

        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#000000';
        context.stroke();
    }

    render() {

        var name = "No layout selected";
        var address = "";
        if (this.state.layout != null) {
            name = this.state.layout.name;
            address = this.state.layout.address;
        }

        return (
            <div>
                <h2>{name}</h2>
                <h5>{address}</h5>
                <canvas id="layoutEditorCanvas"
                        width={LayoutEditor.layoutWidth}
                        height={LayoutEditor.layoutHeight}
                        onClick={this.canvasClick}/>
                <Box maxWidth={LayoutEditor.layoutWidth}>
                    <ImageUploader
                        width={LayoutEditor.layoutWidth}
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
        const response = await fetch('layouteditor/getlayout', {
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

        await fetch('layouteditor/savelayout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                name: layout.name,
                address: layout.address,
                layoutImage: this.state.canvasImageDataURL,
                newAreaLocations: this.state.newAreaLocations
            })
        });
    }
              
}