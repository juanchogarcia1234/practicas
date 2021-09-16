import React from "react";

const Spinner = () => {
  return (
    <div class="ui segment" style={{ width: "100%", height: "100vh" }}>
      <div class="ui active inverted dimmer">
        <div class="ui text loader">Загружается...</div>
      </div>
      <p></p>
    </div>
  );
};

export default Spinner;
