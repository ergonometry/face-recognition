import React from "react";
import Tilt from "react-tilt";
import face from "./face.png";
import "./Navigation.css";

const Navigation = () => {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between" }}>
      <div className="ma3 mt10">
        <Tilt
          className="Tilt br2 shadow-2"
          options={{ max: 50 }}
          style={{ height: 75, width: 75 }}
        >
          <span className="Tilt-inner pa1">
            <img style={{ paddingTop: "4px" }} alt="" src={face} />
          </span>
        </Tilt>
      </div>
    </nav>
  );
};

export default Navigation;
