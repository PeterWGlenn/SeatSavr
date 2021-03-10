import React, { Component } from 'react';
import './SelectArea.css';


export class SelectArea extends Component {
    static displayName = SelectArea.name;

    constructor(props) {
        super(props);
        this.state = { areas: [], loading: true };
    }

    drawLayoutCanvas() {
        var canvas = document.getElementById('layoutCanvas');

        if (canvas != null) {
            var context = canvas.getContext('2d');

            context.beginPath();
            context.arc(80, 80, 12, 0, 2 * Math.PI, false);
            context.fillStyle = 'green';
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = '#003300';
            context.stroke();
        }
    }

    renderAreas(areas) {
        return (
            <h1> testing sub html </h1>
        );
    }

    render() {

        let areaButtons = this.state.loading
            ? <p><em>Loading Areas...</em></p>
            : this.renderAreas(this.state.areas);

        return (
            <div>
                <h1>Please select an area to reserve...</h1>

                <button width={200} height={100} onClick={ this.drawLayoutCanvas }> testing button </button>

                <canvas id="layoutCanvas" width={300} height={300}>
                    { areaButtons }
                </canvas>
            </div>
        );
    }

    async populateAreaData() {
        const response = await fetch('areas');
        const data = await response.json();
        this.setState({ areas: data, loading: false });
    }
}
