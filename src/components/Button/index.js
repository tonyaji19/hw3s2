import React from "react";
import "./Button.css"

function index({text, handleSelect}) {

  return (
    <button type="submit" className="btn" onClick={handleSelect}>
      {text}
    </button>
  );
}

export default index;
