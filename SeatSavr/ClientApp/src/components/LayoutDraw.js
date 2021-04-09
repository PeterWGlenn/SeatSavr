import React from "react";
import { withAuth0 } from '@auth0/auth0-react';
import MenuBar from "./menu-bar";
import Content from "./Content";
import ColorPanel from "./color-panel";

import pencil from "../images/pencil.png";
import line from "../images/line.png";
import brush from "../images/brush.png";
import fill from "../images/fill.png";
import rectangle from "../images/rectangle.png";
import text from "../images/text.png";
import circle from "../images/circle.png";
import erase from "../images/eraser.jpg";
import picker from "../images/picker.png";

const defaultColor = "black";
const defaultTool = "Pencil";

const toolbarItems = [
    { name: "Pencil", image: pencil },
    { name: "Line", image: line },
    { name: "Brush", image: brush },
    { name: "Fill", image: fill },
    { name: "Text", image: text },
    { name: "Rectangle", image: rectangle },
    { name: "Circle", image: circle },
    { name: "Erase", image: erase },
    { name: "Picker", image: picker }
];

class LayoutDraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: defaultColor,
            selectedItem: defaultTool,
            toolbarItems: toolbarItems
        };
        this.changeColor = this.changeColor.bind(this);
        this.changeTool = this.changeTool.bind(this);
    }

    changeColor(event) {
        this.setState({ color: event.target.style.backgroundColor });
    }

    changeTool(event, tool) {
        this.setState({ selectedItem: tool });
    }

    render() {
        return (
            <React.Fragment>
                <MenuBar />
                <Content
                    items={this.state.toolbarItems}
                    activeItem={this.state.selectedItem}
                    handleClick={this.changeTool}
                    color={this.state.color}
                />
                <ColorPanel
                    selectedColor={this.state.color}
                    handleClick={this.changeColor}
                />
            </React.Fragment>
        );
    }
} export default withAuth0(LayoutDraw);