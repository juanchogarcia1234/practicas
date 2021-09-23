import React from "react";

const Spinner = ({ text, position, bg }) => {
  return (
    <div class="ui segment" style={{ width: "100%", height: "100vh", backgroundColor: bg, position: position, border: "none" }}>
      <div class="ui active inverted dimmer" style={{ backgroundColor: bg, border: "none" }}>
        <div class="ui text loader">{text}</div>
      </div>
      <p></p>
    </div>
  );
};

export default Spinner;
