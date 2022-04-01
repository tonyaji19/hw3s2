import React, { useState, useEffect } from "react";
import Card from "../components/Card/";
import Data from "../constants/DataDummy";
import "../components/Card/Card.css";
import Navbar from "../components/Navbar";

function CardItem() {
  const [Token, setToken] = useState("");
  const [Tracks, setTracks] = useState(Data);
  const [Auth, setAuth] = useState(false);
  const [Selected, setSelected] = useState([]);
  const [TrackSelected, setTrackSelected] = useState([]);

  const handleClick = () => {
    const Client_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const Response_Type = "token";
    const Redirect_URI = "http://localhost:3000";
    const Scope = "playlist-modify-private";
    window.location = `https://accounts.spotify.com/authorize?client_id=${Client_ID}&response_type=${Response_Type}&redirect_uri=${Redirect_URI}&scope=${Scope}&show_dialog=true`;
  };

  const getTokenFromUrl = hash => {
    const stringAfterHastag = hash.substring(1);
    const paramInUrl = stringAfterHastag.split("&");
    const paramSplitUp = paramInUrl.reduce((acc, currentValue) => {
      const [key, value] = currentValue.split("=");
      acc[key] = value;
      return acc;
    }, {});
    return paramSplitUp;
  };

  useEffect(() => {
    if (window.location.hash) {
      const access_token = getTokenFromUrl(window.location.hash);
      setToken(access_token);
      setAuth(true);
    }
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    const query = e.target.query.value;
    getTrackData(query);
  };

  const getTrackData = query => {
    const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`;
    if (query) {
      fetch(url, {
        headers: {
          Authorization: "Bearer " + Token.access_token
        }
      })
        .then(res => res.json())
        .then(data =>
          TrackSelected.length > 0
            ? setTracks([
                ...TrackSelected.map(T => Object.assign({}, T)),
                ...data.tracks.items
              ])
            : setTracks(data.tracks.items)
        );
    }
  };

  const handleDeselect = data => {
    setSelected(Selected.filter(S => S !== data.uri));
    setTrackSelected(TrackSelected.filter(T => T.uri !== data.uri));
  };

  const handleSelect = data => {
    setSelected([data.uri, ...Selected]);
    setTrackSelected([data, ...TrackSelected]);
    // setTracks(Tracks.filter(T => T !== data));
    // console.log(data);
  };
  // console.log(Selected);
  console.log(TrackSelected);

  return (
    <>
      <Navbar handleSearch={handleSearch} handleClick={handleClick} />
      {Auth ? (
        <>
          <h1 style={{ marginLeft: 20, marginBottom: 0, fontWeight: 600 }}>
            Create Playlist
          </h1>
          <div className="card-item">
            {Tracks.map(Track =>
              Selected.find(S => S === Track.uri) ? (
                <Card
                  key={Track.uri}
                  image={Track.album.images[0].url}
                  title={Track.name}
                  artist={Track.artists[0].name}
                  album={Track.album.name}
                  url={Track.album.external_urls.spotify}
                  btnText="deselect"
                  handleSelect={() => handleDeselect(Track)}
                />
              ) : (
                <Card
                  key={Track.uri}
                  image={Track.album.images[0].url}
                  title={Track.name}
                  artist={Track.artists[0].name}
                  album={Track.album.name}
                  url={Track.album.external_urls.spotify}
                  btnText="select"
                  handleSelect={() => handleSelect(Track)}
                />
              )
            )}
          </div>
        </>
      ) : (
        <h1 style={{ marginLeft: 20, marginBottom: 0, fontWeight: 600 }}>
          Login ke auth
        </h1>
      )}
    </>
  );
}

export default CardItem;
