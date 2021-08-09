import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const authContext = useContext(AuthContext);
  const { authURL, setCode, login, accessToken } = authContext;
  const history = useHistory();

  const code = new URLSearchParams(window.location.search).get("code");

  useEffect(() => {
    if (code) {
      setCode(code);
      // login(code);
      history.push("/home");
    }
    if (accessToken) {
      history.push("/home");
    }
  });

  return (
    <div className="login-container">
      <div className="login-button">
        <a href={authURL}>Log In With Spotify</a>
      </div>
    </div>
  );
}
