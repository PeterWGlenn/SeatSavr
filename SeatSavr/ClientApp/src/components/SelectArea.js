import React, { Component } from 'react';
import './SelectArea.css';


export class SelectArea extends Component {
    static displayName = SelectArea.name;

    constructor(props) {
        super(props);
        this.componentDidMount = this.drawLayoutCanvas;
        this.state = { areas: [], loading: true };
    }

    static drawSeatIcon(context, x, y) {
        context.beginPath();
        context.arc(x, y, 12, 0, 2 * Math.PI, false);   
        context.fillStyle = 'green';
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();
    }

    drawLayoutCanvas() {
        var canvas = document.getElementById('layoutCanvas');

        if (canvas != null) {
            var context = canvas.getContext('2d');

            SelectArea.drawSeatIcon(context, 80, 40);

            // Draw border
            context.lineWidth = 1;
            context.strokeStyle = "#000000";
            context.strokeRect(0, 0, canvas.width, canvas.height);
        }
    }

    renderAreas(areas) {
        this.drawLayoutCanvas();
    }

    render() {

        return (
            <div>
                <h1>Please select an area to reserve...</h1>
                <canvas id="layoutCanvas" width={888} height={500}/>
            </div>
        );
    }

    async populateAreaData() {
        const response = await fetch('areas');
        const data = await response.json();
        this.setState({ areas: data, loading: false });
    }
}
