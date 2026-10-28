import React from "react";
import PropagateLoader from "react-spinners/PropagateLoader";

// O react-spinners 0.12+ trocou a prop `css` (emotion) por `cssOverride`, um
// objeto de estilo comum.
const override = {
  display: "block",
  marginLeft: "50%",
  marginTop: "5%",
  paddingBottom: "30px",
  borderColor: "#03989f",
};

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
          cssOverride={override}
          size={15}
          color={this.props.color ? this.props.color : "#03989f"}
          loading={this.state.loading}
        />
      </div>
    );
  }
}
export default Loader;
