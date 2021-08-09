import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../constants/baseURL";

export const AuthContext = createContext({
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
  authURL: null,
  code: null,
  setCode: (newCode) => {},
  login: (code) => {},
});

export function AuthProvider(props) {
  const [code, setCode] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post(`${baseURL}/refresh`, {
          refreshToken,
        })
        .then((response) => {
          setRefreshToken(response.data.refreshToken);
          setExpiresIn(response.data.expiresIn);
        })
        .catch((err) => {
          console.error(err);
        });
    }, [expiresIn - 60] * 1000);
    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  useEffect(() => {
    login(code);
  }, [code]);

  const login = (code) => {
    axios
      .post(`${baseURL}/login`, {
        code,
      })
      .then((response) => {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        setExpiresIn(response.data.expiresIn);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        expiresIn,
        authURL:
          "https://accounts.spotify.com/authorize?response_type=code&client_id=f38a8b74578d410086324b24445ca483&redirect_uri=http://localhost:3000/&scope=streaming%20user-read-email%20user-library-read%20user-read-private%20user-library-modify%20user-read-playback-state%20user-modify-playback-state",
        code,
        setCode,
        login,
      }}
      {...props}
    />
  );
}
