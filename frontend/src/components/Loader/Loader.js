import React from "react";
import { css } from "@emotion/core";
import PropagateLoader from "react-spinners/PropagateLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin-left: 50%;
  margin-top: 5%;
  padding-bottom: 30px;
  border-color: #03989f;
`;

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  render() {
    return (
      <div className="sweet-loading">
        <PropagateLoader
          css={override}
          size={15}
          color={this.props.color ? this.props.color : "#03989f"}
          loading={this.state.loading}
        />
      </div>
    );
  }
}
export default Loader;
