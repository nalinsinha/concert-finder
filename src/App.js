import "./App.css";
import SpotifyWebAPI from "spotify-web-api-js";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Artist from "./components/Artist";

const spotify = new SpotifyWebAPI();

function App() {
	const CLIENT_ID = "5003c8800ccb4488acf7163ac7730d1f";
	const REDIRECT_URI = "https://find-concert.herokuapp.com/";
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
					setArtists(a.items);
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
		console.log("ex: artist", artists[0]);
		return artists.map((artist) => (
			<div>
				<Link
					key={artist.id}
					to={{
						pathname: `/artist/${artist.id}`,
						state: "nalin",
					}}
					state={artist}
				>
					<div className="card mb-3">
						<div className="row no-gutters">
							<div className="col-md-4">
								<img
									src={artist.images[2].url}
									className="card-img"
									alt="..."
								/>
							</div>
							<div className="col-md-8">
								<div className="card-body">
									<h5 className="card-title">
										{artist.name}
									</h5>
									<button
										type="button"
										className="btn btn-secondary btn-lg btn-block"
									>
										See concerts
									</button>
								</div>
							</div>
						</div>
					</div>
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
				<span id="title-text" className="navbar-brand mb-0 h1">
					Concert Finder
				</span>
			</nav>
				{spotifyToken ? (
                    <header className="App-header">
                        <Router>
                            <Routes>
                                <Route path="/artist/:id" element={<Artist />} />
                                <Route path="/" element={<ArtistList />} />
                            </Routes>
					    </Router>
                    </header>
					
				) : (
						<div
							className=" text-center bg-image"
							id="backgroundHeader"
						>
							<div
								className="mask"
							>
								<div className="d-flex justify-content-center align-items-center h-100">
									<div className="text-black">
										<h1 className="mb-3">Find concerts from your favorite artists</h1>
										<a
											className="btn btn-outline-light btn-lg btn-dark"
											href={loginURL}
											role="button"
										>
											Login
										</a>
									</div>
								</div>
							</div>
						</div>
			
				)}
		</div>
	);
}

export default App;
