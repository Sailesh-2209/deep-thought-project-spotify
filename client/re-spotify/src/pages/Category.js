import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import Navbar from "../components/Navbar";
import { baseURL } from "../constants/baseURL";
import { AuthContext } from "../context/AuthContext";

export default function Category() {
  const authContext = useContext(AuthContext);
  const { accessToken } = authContext;
  const history = useHistory();
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const cid = window.location.pathname.split("/")[2];

  useEffect(() => {
    if (posts) return;
    axios
      .post(`${baseURL}/categories/${cid}`, {
        accessToken,
      })
      .then((response) => {
        console.log(response.data);
        setPosts(response.data.body);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setPosts(null);
        setError(err);
        history.push("/");
      });
  });

  return (
    <div className="home-container">
      <Navbar />
      <div className="categories-container">
        {posts ? (
          posts.map((post) => {
            const description = post.description;
            const spotify = post.external_urls.spotify;
            const id = post.id;
            const image = post.images[0].url;
            const name = post.name;
            return (
              <div key={id} className="category-card">
                <a href={spotify} target="_blank" rel="noreferrer">
                  <div>
                    <img src={image} alt={name} />
                  </div>
                  <div>{name}</div>
                  <div>{description}</div>
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
