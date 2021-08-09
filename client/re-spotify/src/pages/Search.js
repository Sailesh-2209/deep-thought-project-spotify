import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { baseURL } from "../constants/baseURL";

export default function Search() {
  const authContext = useContext(AuthContext);
  const [artists, setArtists] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [error, setError] = useState(null);
  const [value, setValue] = useState("");
  const { accessToken } = authContext;

  useEffect(() => {
    axios
      .post(`${baseURL}/search/artists`, {
        accessToken,
        searchQuery: value,
      })
      .then((response) => {
        setArtists(response.data.body);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
    axios
      .post(`${baseURL}/search/albums`, {
        accessToken,
        searchQuery: value,
      })
      .then((response) => {
        setAlbums(response.data.body);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [accessToken, value]);

  return (
    <div className="home-container">
      <Navbar />
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="search for artists or songs"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="search-results-container">
          {albums ? (
            albums.map((album) => {
              console.log(album);
              const photo = album.album.images[0]["url"];
              const artist = album.artists[0].name;
              const id = album.album.id;
              const name = album.album.name;
              const releaseDate = album.album.release_date;
              const num_tracks = album.total_tracks;
              const duration = `${album.durations / 60} minutes`;
              const url = album.external_urls.spotify;
              return (
                <div key={id} className="search-result">
                  <a href={url} target="_blank" rel="noreferrer">
                    <div>
                      <img src={photo} alt={name} />
                    </div>
                    <div>
                      {releaseDate}
                      {artist}
                      {num_tracks}
                      {duration}
                    </div>
                  </a>
                </div>
              );
            })
          ) : (
            <div>{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
