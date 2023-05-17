import React, { Component } from "react";
import "./Tag.css";

class Tag extends Component {
  constructor(props) {
    super(props);
    this.txt = props.txt;
    this.backgroundColor = props.backgroundColor;
    this.color = props.color;
    this.className = props.className;
    this.href = props.href === null ? null : props.href;
  }

  render() {
    if (this.href == null)
      return (
        <div
          className={"tag " + this.className}
          style={{ background: this.backgroundColor, color: this.color }}
        >
          {this.txt}
        </div>
      );
    else
      return (
        <a target="_blank" rel="noopener noreferrer" href={this.href}>
          <div
            className={"tag linked " + this.className}
            style={{ background: this.backgroundColor, color: this.color }}
          >
            {this.txt}
          </div>
        </a>
      );
  }
}

export default Tag;
