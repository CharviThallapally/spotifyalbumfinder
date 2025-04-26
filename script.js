import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [albums, setAlbums] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  // Step 1: Get Access Token
  useEffect(() => {
    const getAccessToken = async () => {
      const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
      const encodedCredentials = btoa(`${clientId}:${clientSecret}`);
      
      try {
        const response = await axios.post(
          'https://accounts.spotify.com/api/token',
          'grant_type=client_credentials',
          {
            headers: {
              'Authorization': `Basic ${encodedCredentials}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        setAccessToken(response.data.access_token); // Store the access token
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    getAccessToken();
  }, []); // Only run once when the component mounts

  // Step 2: Fetch Albums
  const searchAlbums = async () => {
    if (!searchQuery) return; // Avoid searching when the query is empty

    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${searchQuery}&type=album`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAlbums(response.data.albums.items); // Update albums state
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  return (
    <div className="App">
      <h1>Spotify Album Finder</h1>
      <input
        type="text"
        placeholder="Enter artist or album name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
      />
      <button onClick={searchAlbums}>Search</button>

      <div className="album-list">
        {albums.length === 0 ? (
          <p>No albums found. Try searching for something else!</p>
        ) : (
          albums.map((album) => (
            <div key={album.id} className="album">
              <img
                src={album.images[0]?.url}
                alt={album.name}
                width="200"
                height="200"
              />
              <p><strong>{album.name}</strong></p>
              <p><em>{album.artists[0]?.name}</em></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
