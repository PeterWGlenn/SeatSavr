import React, { Component } from "react";

const Button = props => {
    const style = {
        __html: props.image
    };

    return (
        <button
            className={"button " + (props.active ? "selected" : "")}
            dangerouslySetInnerHTML={style}
            onClick={e => props.handleClick(e, props.name)}
        ></button> 
    );
};

class TransformText extends Component {
    state = {
        text: this.props.text
    };

    render() {
        return this.state.text;
    }
}

export default class Toolbox extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event, name) {
        this.props.handleClick(event, name);
    }

    render() {
        const items = this.props.items.map(item => (
            <><TransformText text={item.name}></TransformText>
                <Button
                    active={this.props.activeItem === item.name ? true : false}
                    name={item.name}
                    image={item.image}
                    key={item.name}
                    handleClick={this.handleClick}
                >  </Button></>
        ));

        return <div className="toolbox">{items}</div>;
    }
}