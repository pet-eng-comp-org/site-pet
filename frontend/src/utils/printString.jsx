import React from "react";
function printString(str) {
  let textArray = str.split("\n");
  return textArray.map((paragraph, index) => <p key={index}>{paragraph}</p>);
}
export default printString;
