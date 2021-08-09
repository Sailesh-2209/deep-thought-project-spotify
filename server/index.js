import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import SpotifyWebApi from "spotify-web-api-node";

const config = dotenv.config();

const port = 5000;

const app = express();
app.use(bodyParser.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirectUri = "http://localhost:3000/";

app.use(cors());
app.use((req, res, next) => {
  //   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "GET");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.send("Server for spotify auth");
});

app.post("/login", function (req, res) {
  const code = req.body.code;
  let spotifyApi = new SpotifyWebApi({
    redirectUri,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  });
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        expiresIn: data.body.expires_in,
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
      });
      spotifyApi.setAccessToken(data.body.access_token);
      spotifyApi.setRefreshToken(data.body.refresh_token);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  let spotifyApi = new SpotifyWebApi({
    redirectUri,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken,
  });
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/home", (req, res) => {
  const accessToken = req.body.accessToken;
  let spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri,
  });
  spotifyApi.setAccessToken(accessToken);
  spotifyApi
    .getFeaturedPlaylists({
      limit: 50,
      offset: 1,
      country: "SE",
      locale: "sv_SE",
      timestamp: "2020-10-23T09:00:00",
    })
    .then((data) => {
      res.json({
        body: data.body,
      });
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    });
});

app.post("/search/artists", (req, res) => {
  const accessToken = req.body.accessToken;
  const searchQuery =
    req.body.searchQuery === "" ? "Love" : req.body.searchQuery;
  let spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri,
  });
  spotifyApi.setAccessToken(accessToken);
  spotifyApi
    .searchArtists(searchQuery)
    .then((data) => {
      res.json({
        body: data.body.artists.items,
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(404);
    });
});

app.post("/search/albums", (req, res) => {
  const accessToken = req.body.accessToken;
  const searchQuery =
    req.body.searchQuery === "" ? "Love" : req.body.searchQuery;
  let spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri,
  });
  spotifyApi.setAccessToken(accessToken);
  spotifyApi
    .searchTracks(searchQuery)
    .then((data) => {
      res.json({
        body: data.body.tracks.items,
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(404);
    });
});

app.post("/new", (req, res) => {
  const accessToken = req.body.accessToken;
  let spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri,
  });
  spotifyApi.setAccessToken(accessToken);
  spotifyApi
    .getNewReleases({ limit: 20, offset: 0, country: "SE" })
    .then((data) => {
      res.json({
        body: data.body.albums.items,
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(404);
    });
});

app.post("/categories", (req, res) => {
  const accessToken = req.body.accessToken;
  let spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri,
  });
  spotifyApi.setAccessToken(accessToken);
  spotifyApi
    .getCategories({
      limit: 20,
      offset: 0,
      country: "SE",
      locale: "sv_SE",
    })
    .then((data) => {
      res.json({
        body: data.body.categories.items,
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(404);
    });
});

app.post("/categories/:cid", (req, res) => {
  const accessToken = req.body.accessToken;
  const category = req.params.cid;
  let spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri,
  });
  spotifyApi.setAccessToken(accessToken);
  spotifyApi
    .getPlaylistsForCategory(category ? category : "pop", {
      country: "SE",
      limit: 20,
      offset: 0,
    })
    .then((data) => {
      res.json({
        body: data.body.playlists.items,
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(404);
    });
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
