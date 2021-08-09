import axios from "axios";
import { useHistory } from "react-router";
import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { baseURL } from "../constants/baseURL";
import { AuthContext } from "../context/AuthContext";

export default function NewReleases() {
  const authContext = useContext(AuthContext);
  const { accessToken } = authContext;
  const history = useHistory();
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (posts) return;
    axios
      .post(`${baseURL}/new`, {
        accessToken,
      })
      .then((response) => {
        console.log(response.data.body);
        setPosts(response.data.body);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setPosts(null);
        history.push("/login");
        console.error(err);
      });
  });

  return (
    <div className="home-container">
      <Navbar />
      <div className="new-container">
        {posts ? (
          posts.map((post) => {
            const artist = post.artists[0].name;
            const spotify = post.external_urls.spotify;
            const id = post.id;
            const image = post.images[0].url;
            console.log(image);
            const name = post.name;
            return (
              <div key={id} className="new-card-container">
                <a href={spotify} target="_blank" rel="noreferrer">
                  <div>
                    <img src={image} alt={name} />
                  </div>
                  <div>{artist}</div>
                  <div>{name}</div>
                </a>
              </div>
            );
          })
        ) : (
          <div>{error ? error.message : "error"}</div>
        )}
      </div>
    </div>
  );
}
