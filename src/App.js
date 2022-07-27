import "./App.css";
import SpotifyWebAPI from "spotify-web-api-js";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	useParams,
} from "react-router-dom";
import React, { useEffect, useState } from "react";

const spotify = new SpotifyWebAPI();
const Artist = () => {
	const id = useParams().id;
	return (
		<div>
			<h1>{id}</h1>
		</div>
	);
};

function App() {
	const CLIENT_ID = "5003c8800ccb4488acf7163ac7730d1f";
	const REDIRECT_URI = "http://localhost:3000";
	const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
	const RESPONSE_TYPE = "token";
	const scopes = ["user-top-read", "user-follow-read"];
	const loginURL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scopes.join(
		"%20"
	)}`;

	useEffect(() => {
		console.log("derive from url", getTokenFromURL());

		const token = getTokenFromURL().access_token;

		window.location.hash = "";

		console.log("token: ", token);

		if (token) {
			setToken(token);
			spotify.setAccessToken(token);

			spotify.getMe().then((user) => console.log("user: ", user));

			spotify
				.getMyTopArtists()
				.then((a) => {
					console.log("top artists: ", a);
					const names = a.items.map((t) => {
						return { name: t.name, id: t.id };
					});
					console.log("a: ", names);
					setArtists(names);
				})
				.then(function(data) {
					console.log(artists);
					console.log("data:", data);
				});
		}
	}, []);

	const [spotifyToken, setToken] = useState("");
	const [artists, setArtists] = useState([]);

	const getTokenFromURL = () => {
		return window.location.hash
			.substring(1)
			.split("&")
			.reduce((initial, item) => {
				let parts = item.split("=");
				initial[parts[0]] = decodeURIComponent(parts[1]);
				return initial;
			}, {});
	};

	const renderArtists = () => {
		return artists.map((artist) => (
			<div>
				<Link key={artist.id} to={`/artist/${artist.id}`}>
					{artist.name}
				</Link>
			</div>
		));
	};
	const ArtistList = () => {
		return <div id="artistList">{renderArtists()}</div>;
	};

	return (
		<div className="App">
            <nav className="navbar navbar-dark bg-dark">
					<span id="title-text" className="navbar-brand mb-0 h1">Concert Finder</span>
			</nav>
			<header className="App-header">
				
				{spotifyToken ? (
					<Router>
						<Routes>
							<Route path="/artist/:id" element={<Artist />} />
							<Route path="/" element={<ArtistList />} />
						</Routes>
					</Router>
				) : (
					<div>
						<a href={loginURL}>Sign in with Spotify</a>
						<h2>Please Login</h2>
					</div>
				)}
			</header>
		</div>
	);
}

export default App;
