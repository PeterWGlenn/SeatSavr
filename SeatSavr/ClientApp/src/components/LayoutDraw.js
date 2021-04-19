import React from "react";
import { withAuth0 } from '@auth0/auth0-react';
import Content from "./Content";
import ColorPanel from "./color-panel";

import TextField from '@material-ui/core/TextField'

const defaultColor = "black";


const toolbarItems = [
    { name: "Pencil" },
    { name: "Line" },
    { name: "Brush" },
    // TODO { name: "Fill"},
    // TODO{ name: "Text" },
    { name: "Rectangle" },
    //TODO { name: "Circle" },
    //TODO { name: "Erase" },
    //TODO { name: "Picker" }
];

class LayoutDraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: defaultColor,
            toolbarItems: toolbarItems,
            canvasImageDataURL: null
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
                <p>
                    <form className='Name enter' noValidate autoComplete="off">
                        <TextField id="standard-basic" label="Enter Layout Name Here" />
                    </form>
                </p>
                                
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