import React from "react";
import { useHistory } from "react-router";

export default function Navbar() {
  const history = useHistory();

  return (
    <div className="home-navbar">
      <button onClick={() => history.push("/home")}>HOME</button>
      {/* <button onClick={() => history.push("/search")}>SEARCH</button> */}
      <button onClick={() => history.push("/new")}>NEW RELEASES</button>
      <button onClick={() => history.push("/categories")}>CATEGORIES</button>
      <button onClick={() => history.push("/profile")}>PROFILE</button>
    </div>
  );
}
