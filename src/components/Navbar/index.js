import React, { useState, useEffect } from "react";
import Search from "../Search/Index";
import Button from "../Button";
import Navbar from  "./style.module.css";

function Index({ handleSearch, handleClick }) {
  const [Auth, setAuth] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      setAuth(true);
    }
  }, []);

  return (
    <header>
      <div className={Navbar.logo}>Sportifiyi</div>
      {Auth ? (
        <div>
          <Search handleSubmit={handleSearch} />
        </div>
      ) : (
        <div onClick={handleClick}>
          <Button text="LOGIN"/>
        </div>
      )}
    </header>
  );
}

export default Index;
