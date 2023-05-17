import React, { useState } from "react";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";

const PickColor = ({ colorForm }) => {
  const [display, setDisplay] = useState(false);
  const [color, setColor] = useState({
    hex: "#2bbbad",
  });

  const handleClick = () => {
    setDisplay(!display);
  };

  const handleClose = () => {
    setDisplay(false);
  };

  const handleChange = (c) => {
    colorForm(c.hex);
    setColor(c);
  };

  const styles = reactCSS({
    default: {
      color: {
        width: "36px",
        height: "14px",
        borderRadius: "2px",
        background: color.hex,
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {display ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
};

export default PickColor;
