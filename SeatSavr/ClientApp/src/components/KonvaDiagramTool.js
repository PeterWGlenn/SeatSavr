import React from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Star, Text } from "react-konva";



export class KonvaDiagramTool extends Component {

    constructor(props) {
        this.state(props);
    }

    function generateShapes() {
        return [...Array(10)].map((_, i) => ({
        id: i.toString(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 180,
        isDragging: false,
    }));
}

const INITAL_STATE = generateShapes();

const App = () -> {

}
}
