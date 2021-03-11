import React, { Component } from 'react';
import './SelectArea.css';


export class SelectArea extends Component {
    static displayName = SelectArea.name;

    constructor(props) {
        super(props);
        this.state = { areas: [], loading: true };

        this.layoutWidth = 888;
        this.layoutHeight = 500;
    }

    componentDidMount() {
        this.renderAreas();
    }

    render() {
        return (
            <div>
                <h1>Please select an area to reserve...</h1>
                <canvas id="layoutCanvas" width={this.layoutWidth} height={this.layoutHeight}/>
            </div>
        );
    }

    async renderAreas() {
        await this.populateAreaData();

        var canvas = document.getElementById('layoutCanvas');
        if (canvas != null) {
            var context = canvas.getContext('2d');

            // Draw border
            context.lineWidth = 1;
            context.strokeStyle = "#000000";
            context.strokeRect(0, 0, canvas.width, canvas.height);

            // Draw areas
            this.state.areas.forEach(area => {

                var xLoc = (area.areaLocation.x / 100) * this.layoutWidth;
                var yLoc = (area.areaLocation.y / 100) * this.layoutHeight;

                SelectArea.drawSeatIcon(context, xLoc, yLoc);
            });
        }
    }

    async populateAreaData() {
        const response = await fetch('selectarea'); 
        const data = await response.json();
        this.setState({ areas: data, loading: false });
    }

    static drawSeatIcon(context, x, y) {
        context.beginPath();
        context.arc(x, y, 12, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#000000';
        context.stroke();
    }
}
