import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { baseURL } from "../constants/baseURL";

export default function Home() {
  const authContext = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const { accessToken } = authContext;

  useEffect(() => {
    if (posts) return;
    axios
      .post(`${baseURL}/home`, {
        accessToken,
      })
      .then((response) => {
        setPosts(response.data.body.playlists.items);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  });

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-cards-container">
        {posts ? (
          posts.map((item, index) => {
            const photo = item.images[0]["url"];
            const name = item.name;
            return (
              <div key={index} className="home-card">
                <div>
                  <img src={photo} alt={name} />
                </div>
                <div>{name}</div>
              </div>
            );
          })
        ) : (
          <div>{error}</div>
        )}
      </div>
    </div>
  );
}
